'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    AlertCircle, CheckCircle2, CloudUpload, FileArchive,
    Loader2, Upload, X, Tag
} from 'lucide-react';
import { completeUpload, getStsCredentials, getUploadStatus, STSCredentials } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import {
    TAG_CATEGORIES, TagCategory, TagsData, serializeTags, getCategoryLabel, getOptionLabel
} from '@/lib/tagConfig';
import { useLang } from '@/lib/LangContext';

type UploadPhase = 'idle' | 'getting_sts' | 'uploading' | 'validating' | 'done' | 'error';

interface FileItem {
    file: File;
    relativePath: string;
}

// ─── Tailwind 颜色映射（color key → class strings） ──────────────────────────
const COLOR_MAP: Record<string, { active: string; hover: string }> = {
    indigo: { active: 'bg-indigo-600 border-indigo-600 text-white', hover: 'hover:border-indigo-300 hover:text-indigo-600' },
    emerald: { active: 'bg-emerald-600 border-emerald-600 text-white', hover: 'hover:border-emerald-300 hover:text-emerald-600' },
    amber: { active: 'bg-amber-500 border-amber-500 text-white', hover: 'hover:border-amber-300 hover:text-amber-600' },
    violet: { active: 'bg-violet-600 border-violet-600 text-white', hover: 'hover:border-violet-300 hover:text-violet-600' },
    cyan: { active: 'bg-cyan-600 border-cyan-600 text-white', hover: 'hover:border-cyan-300 hover:text-cyan-600' },
};

// ─── Tag 选择器组件 ─────────────────────────────────────────────────────────

interface TagSelectorProps {
    category: TagCategory;
    value: string | string[] | undefined;
    lang: 'zh' | 'en';
    onChange: (key: string, value: string | string[] | undefined) => void;
}

function TagSelector({ category, value, lang, onChange }: TagSelectorProps) {
    const colors = COLOR_MAP[category.color] ?? COLOR_MAP['indigo'];

    const handleClick = (option: string) => {
        if (category.type === 'single') {
            onChange(category.key, value === option ? undefined : option);
        } else {
            const arr = Array.isArray(value) ? value : [];
            onChange(
                category.key,
                arr.includes(option) ? arr.filter(v => v !== option) : [...arr, option]
            );
        }
    };

    const isSelected = (option: string) =>
        category.type === 'single'
            ? value === option
            : Array.isArray(value) && value.includes(option);

    const typeHint = category.type === 'single'
        ? (lang === 'en' ? 'single select' : '单选')
        : (lang === 'en' ? 'multi select' : '多选，可不选');

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {getCategoryLabel(category, lang)}
                {category.required && <span className="text-red-400">*</span>}
                <span className="text-xs text-slate-400 font-normal">（{typeHint}）</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {category.options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => handleClick(option)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${isSelected(option)
                            ? colors.active
                            : `bg-white border-slate-200 text-slate-600 ${colors.hover}`
                            }`}
                    >
                        {getOptionLabel(category, option, lang)}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function UploadPage() {
    const { user, loading: authLoading } = useAuth();
    const { lang } = useLang();
    const router = useRouter();

    const [phase, setPhase] = useState<UploadPhase>('idle');
    const [datasetName, setDatasetName] = useState('');
    const [description, setDescription] = useState('');
    // 结构化 tags 状态：key → string（单选）| string[]（多选）
    const [tagsData, setTagsData] = useState<TagsData>({});
    const [files, setFiles] = useState<FileItem[]>([]);
    const [progress, setProgress] = useState(0);
    const [statusMsg, setStatusMsg] = useState('');
    const [uploadId, setUploadId] = useState('');
    const [datasetId, setDatasetId] = useState('');
    const [validationError, setValidationError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const handleTagChange = (key: string, value: string | string[] | undefined) => {
        setTagsData(prev => {
            const next = { ...prev };
            if (value === undefined || (Array.isArray(value) && value.length === 0)) {
                delete next[key];
            } else {
                next[key] = value;
            }
            return next;
        });
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/auth?next=/upload');
        }
    }, [user, authLoading, router]);

    // 轮询上传状态
    useEffect(() => {
        if (phase === 'validating' && uploadId) {
            pollRef.current = setInterval(async () => {
                try {
                    const status = await getUploadStatus(uploadId);
                    if (status.status === 'passed') {
                        clearInterval(pollRef.current!);
                        setDatasetId(status.dataset_id || '');
                        setPhase('done');
                    } else if (status.status === 'failed') {
                        clearInterval(pollRef.current!);
                        setValidationError(status.error_message || '校验失败');
                        setPhase('error');
                    }
                } catch { }
            }, 3000);
        }
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [phase, uploadId]);

    const handleFileDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const items = e.dataTransfer.items;
        collectFiles(items);
    }, []);

    const collectFiles = (items: DataTransferItemList) => {
        const collected: FileItem[] = [];
        const traverse = (entry: FileSystemEntry, path: string): Promise<void> => {
            return new Promise((resolve) => {
                if (entry.isFile) {
                    (entry as FileSystemFileEntry).file((file) => {
                        collected.push({ file, relativePath: path + file.name });
                        resolve();
                    });
                } else if (entry.isDirectory) {
                    const reader = (entry as FileSystemDirectoryEntry).createReader();
                    reader.readEntries(async (entries) => {
                        await Promise.all(entries.map((e) => traverse(e, path + entry.name + "/")));
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        };
        const promises: Promise<void>[] = [];
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry();
            if (entry) promises.push(traverse(entry, ""));
        }
        Promise.all(promises).then(() => setFiles(collected));
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files;
        if (!selected) return;
        const items: FileItem[] = [];
        for (let i = 0; i < selected.length; i++) {
            const f = selected[i];
            items.push({ file: f, relativePath: (f as unknown as { webkitRelativePath?: string }).webkitRelativePath || f.name });
        }
        setFiles(items);
    };

    // 上传单个文件到 OSS（通过 OSS SDK / presigned URL 方式）
    // 这里使用简单的 PUT 请求，实际部署时可引入 ali-oss SDK
    const uploadFileToOSS = async (
        creds: STSCredentials,
        fileItem: FileItem,
        ossDir: string,
        onProgress: (done: number, total: number) => void,
        index: number,
        total: number
    ) => {
        const key = ossDir + fileItem.relativePath;
        const endpoint = creds.endpoint.replace("https://", "");
        const url = `https://${creds.bucket}.${endpoint}/${key}`;

        // 使用 XMLHttpRequest 支持进度回调
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", url);
            xhr.setRequestHeader("x-oss-security-token", creds.security_token);
            xhr.upload.onprogress = () => onProgress(index, total);
            xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`OSS PUT 失败: ${xhr.status}`)));
            xhr.onerror = () => reject(new Error("网络错误"));
            xhr.send(fileItem.file);
        });
    };

    const handleUpload = async () => {
        if (!datasetName.trim()) {
            setStatusMsg('请输入数据集名称');
            return;
        }
        if (files.length === 0) {
            setStatusMsg('请选择数据集文件夹');
            return;
        }

        setPhase('getting_sts');
        setStatusMsg('正在获取上传凭证...');
        try {
            const creds = await getStsCredentials();
            setUploadId(creds.upload_id);

            setPhase('uploading');
            setProgress(0);

            for (let i = 0; i < files.length; i++) {
                setStatusMsg(`正在上传 ${i + 1} / ${files.length}: ${files[i].relativePath}`);
                await uploadFileToOSS(
                    creds,
                    files[i],
                    creds.upload_dir,
                    (done, total) => setProgress(Math.round((done / total) * 100)),
                    i + 1,
                    files.length
                );
                setProgress(Math.round(((i + 1) / files.length) * 100));
            }

            setStatusMsg('上传完成，正在触发校验...');
            await completeUpload({
                upload_id: creds.upload_id,
                dataset_name: datasetName,
                oss_path: creds.upload_dir,
                description: description.trim() || undefined,
                tags: Object.keys(tagsData).length > 0 ? serializeTags(tagsData) : undefined,
            });

            setPhase('validating');
            setStatusMsg('数据集格式校验中，请稍候...');
        } catch (e: unknown) {
            setValidationError((e as Error).message || '上传失败');
            setPhase('error');
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-8">
                        <CloudUpload className="w-7 h-7 text-indigo-500" />
                        <h1 className="text-2xl font-black text-slate-800">上传数据集</h1>
                    </div>

                    {/* 成功 */}
                    {phase === 'done' && (
                        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                            <h2 className="text-lg font-bold text-emerald-700 mb-2">上传并校验成功！</h2>
                            <p className="text-sm text-emerald-600 mb-4">数据集已创建，您现在可以设置为公开。</p>
                            {datasetId && (
                                <button
                                    onClick={() => router.push(`/datasets/${datasetId}`)}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition"
                                >
                                    查看数据集
                                </button>
                            )}
                        </div>
                    )}

                    {/* 错误 */}
                    {phase === 'error' && (
                        <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <h2 className="text-sm font-bold text-red-700 mb-1">校验失败</h2>
                                    <p className="text-sm text-red-600 whitespace-pre-wrap">{validationError}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { setPhase('idle'); setFiles([]); setValidationError(''); }}
                                className="mt-4 px-5 py-2 rounded-xl bg-red-100 text-red-700 font-semibold text-sm hover:bg-red-200 transition"
                            >
                                重新上传
                            </button>
                        </div>
                    )}

                    {/* 进行中 */}
                    {(phase === 'uploading' || phase === 'getting_sts' || phase === 'validating') && (
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                                <p className="text-sm font-medium text-slate-700">{statusMsg}</p>
                            </div>
                            {phase === 'uploading' && (
                                <div className="w-full bg-slate-100 rounded-full h-2">
                                    <div
                                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 表单 */}
                    {phase === 'idle' && (
                        <div className="space-y-6">
                            {/* 数据集名称 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    数据集名称 <span className="text-red-400">*</span>
                                </label>
                                <input
                                    value={datasetName}
                                    onChange={(e) => setDatasetName(e.target.value)}
                                    placeholder="例如：my_robot_grasping_dataset"
                                    className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white placeholder-slate-400"
                                />
                            </div>

                            {/* 数据集描述 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    数据集描述
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="简要描述数据集的采集环境、任务目标和数据特点..."
                                    className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-white placeholder-slate-400 resize-none"
                                />
                            </div>

                            {/* Tag 选择器 - 遍历所有分类 */}
                            {TAG_CATEGORIES.map((category) => (
                                <TagSelector
                                    key={category.key}
                                    category={category}
                                    value={tagsData[category.key]}
                                    lang={lang}
                                    onChange={handleTagChange}
                                />
                            ))}

                            {/* 文件拖放区 */}
                            <div
                                className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer ${dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => inputRef.current?.click()}
                            >
                                <FileArchive className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                <p className="text-sm font-semibold text-slate-700 mb-1">
                                    拖放数据集文件夹到此处，或点击选择
                                </p>
                                <p className="text-xs text-slate-400">
                                    支持 LeRobot v2.1 / v3.0 格式目录结构
                                </p>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    multiple
                                    // @ts-expect-error webkitdirectory is non-standard
                                    webkitdirectory="true"
                                    className="hidden"
                                    onChange={handleFileInput}
                                />
                            </div>

                            {/* 文件列表预览 */}
                            {files.length > 0 && (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-xs font-semibold text-slate-600">
                                            已选择 {files.length} 个文件
                                        </p>
                                        <button
                                            onClick={() => setFiles([])}
                                            className="text-slate-400 hover:text-slate-600 transition"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <ul className="text-xs text-slate-500 space-y-1 max-h-32 overflow-y-auto font-mono">
                                        {files.slice(0, 20).map((f, i) => (
                                            <li key={i} className="truncate">{f.relativePath}</li>
                                        ))}
                                        {files.length > 20 && (
                                            <li className="text-slate-400">...还有 {files.length - 20} 个文件</li>
                                        )}
                                    </ul>
                                </div>
                            )}

                            {statusMsg && (
                                <p className="text-sm text-red-500">{statusMsg}</p>
                            )}

                            {/* 格式说明 */}
                            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 space-y-1">
                                <p className="font-semibold">LeRobot 格式要求（v2.1 / v3.0）：</p>
                                <p>• 必须包含 <code className="bg-blue-100 px-1 rounded">meta/info.json</code> 文件</p>
                                <p>• 必须包含 <code className="bg-blue-100 px-1 rounded">data/chunk-000/episode_*.parquet</code> 格式数据</p>
                                <p>• info.json 中必须包含 fps、total_episodes、features 等字段</p>
                                <p>• v3.0 还需要 <code className="bg-blue-100 px-1 rounded">meta/episodes.parquet</code></p>
                            </div>

                            <button
                                onClick={handleUpload}
                                disabled={files.length === 0 || !datasetName.trim()}
                                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                            >
                                <Upload className="w-4 h-4" />
                                开始上传
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
