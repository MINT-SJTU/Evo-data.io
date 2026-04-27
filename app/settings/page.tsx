'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    ChevronUp,
    Database,
    Download,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Pencil,
    Phone,
    RefreshCw,
    Save,
    Settings,
    ShieldCheck,
    Tag,
    X,
} from 'lucide-react';
import {
    adminListAllDatasets,
    changePhone,
    DatasetListItem,
    formatBytes,
    getCaptcha,
    getDownloadUrl,
    getMyDatasets,
    resetPassword,
    sendSms,
    updateDataset,
    updateNickname,
} from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/LangContext';
import { TAG_CATEGORIES, TagsData, parseTags, serializeTags, flattenTags, getCategoryLabel, getOptionLabel } from '@/lib/tagConfig';

// ─── 倒计时 Hook ───────────────────────────────────────────────────────────────
function useCountdown() {
    const [countdown, setCountdown] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const start = (seconds = 60) => {
        setCountdown(seconds);
        if (timer.current) clearInterval(timer.current);
        timer.current = setInterval(() => {
            setCountdown((c) => { if (c <= 1) { clearInterval(timer.current!); return 0; } return c - 1; });
        }, 1000);
    };
    useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
    return { countdown, start };
}

type Tab = 'account' | 'my_datasets' | 'admin';

// ═══════════════════════════════════════════════════════════════════════════════
// 主页面
// ═══════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('account');

    useEffect(() => { if (!user) router.replace('/auth'); }, [user, router]);
    if (!user) return null;

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        { key: 'account', label: '账号设置', icon: <Settings className="w-4 h-4" /> },
        { key: 'my_datasets', label: '我的数据集', icon: <Database className="w-4 h-4" /> },
        ...(user.level === 'admin' ? [{ key: 'admin' as Tab, label: '数据管理', icon: <ShieldCheck className="w-4 h-4" /> }] : []),
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* 用户信息卡 */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg select-none">
                        {user.phone.slice(0, 1)}
                    </div>
                    <div>
                        <p className="text-base font-semibold text-slate-800">
                            {user.phone.slice(0, 3)}****{user.phone.slice(7)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.level === 'admin' ? 'bg-rose-100 text-rose-700' : user.level === 'contributor' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                {user.level === 'admin' ? '管理员' : user.level === 'contributor' ? '贡献者' : '普通用户'}
                            </span>
                            <span className="text-xs text-slate-400">排名 #{user.rank}</span>
                        </div>
                    </div>
                </div>

                {/* Tab 导航 */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-5">
                    {tabs.map((t) => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === t.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                            {t.icon}{t.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
                        {activeTab === 'account' && <AccountTab user={user} />}
                        {activeTab === 'my_datasets' && <MyDatasetsTab />}
                        {activeTab === 'admin' && user.level === 'admin' && <AdminTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Tab：账号设置
// ═══════════════════════════════════════════════════════════════════════════════
function AccountTab({ user }: { user: { phone: string; has_password: boolean; nickname: string | null } }) {
    type Panel = 'change_phone' | 'reset_password';
    const [activePanel, setActivePanel] = useState<Panel | null>(null);
    const { setUser, user: ctxUser } = useAuth();

    // ── 昵称编辑 ──────────────────────────────────────────────────────────────
    const [nickname, setNickname] = useState(user.nickname || '');
    const [nickEditing, setNickEditing] = useState(false);
    const [nickSaving, setNickSaving] = useState(false);
    const [nickMsg, setNickMsg] = useState('');

    const handleSaveNickname = async () => {
        setNickSaving(true); setNickMsg('');
        try {
            const updated = await updateNickname(nickname);
            if (ctxUser) setUser({ ...ctxUser, nickname: updated.nickname });
            setNickMsg('✓ 已保存');
            setNickEditing(false);
            setTimeout(() => setNickMsg(''), 3000);
        } catch (e: unknown) {
            setNickMsg('❌ ' + ((e as Error).message || '保存失败'));
        } finally {
            setNickSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {/* 昵称 */}
            <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">昵称</span>
                    {!nickEditing && (
                        <button onClick={() => setNickEditing(true)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800">
                            <Pencil className="w-3.5 h-3.5" /> 编辑
                        </button>
                    )}
                </div>
                {nickEditing ? (
                    <div className="flex gap-2 items-center">
                        <input
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            maxLength={20}
                            placeholder="最多20个字符"
                            className="flex-1 px-3 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <button onClick={handleSaveNickname} disabled={nickSaving}
                            className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white text-xs rounded-xl hover:bg-indigo-700 disabled:opacity-60">
                            {nickSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 保存
                        </button>
                        <button onClick={() => { setNickEditing(false); setNickname(user.nickname || ''); }}
                            className="px-3 py-2 text-xs text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50">取消</button>
                    </div>
                ) : (
                    <p className="text-sm text-slate-500">{user.nickname || <span className="italic text-slate-300">未设置</span>}</p>
                )}
                {nickMsg && <p className={`text-xs mt-1 ${nickMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>{nickMsg}</p>}
            </div>

            <button onClick={() => setActivePanel(activePanel === 'change_phone' ? null : 'change_phone')}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-slate-700">更换绑定手机号</span>
                </div>
                {activePanel === 'change_phone' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {activePanel === 'change_phone' && <div className="px-5 pt-4 pb-5"><ChangePhoneForm onSuccess={() => setActivePanel(null)} /></div>}

            <button onClick={() => setActivePanel(activePanel === 'reset_password' ? null : 'reset_password')}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                    <KeyRound className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-slate-700">{user.has_password ? '重置密码' : '设置登录密码'}</span>
                </div>
                {activePanel === 'reset_password' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {activePanel === 'reset_password' && <div className="px-5 pt-4 pb-5"><ResetPasswordForm phone={user.phone} onSuccess={() => setActivePanel(null)} /></div>}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Tab：我的数据集
// ═══════════════════════════════════════════════════════════════════════════════
function MyDatasetsTab() {
    const [datasets, setDatasets] = useState<DatasetListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const load = useCallback(async () => {
        setLoading(true); setError('');
        try { setDatasets(await getMyDatasets()); }
        catch (e: unknown) { setError((e as Error).message || '加载失败'); }
        finally { setLoading(false); }
    }, []);
    useEffect(() => { load(); }, [load]);

    if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>;
    if (error) return <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>;
    if (datasets.length === 0) return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <Database className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">你还没有上传任何数据集</p>
        </div>
    );
    return <div className="space-y-3">{datasets.map((d) => <DatasetCard key={d.id} dataset={d} isOwner onUpdated={load} />)}</div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Tab：数据管理（admin）
// ═══════════════════════════════════════════════════════════════════════════════
function AdminTab() {
    const [datasets, setDatasets] = useState<DatasetListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');

    const load = useCallback(async () => {
        setLoading(true); setError('');
        try { setDatasets(await adminListAllDatasets({ search: query || undefined, limit: 100 })); }
        catch (e: unknown) { setError((e as Error).message || '加载失败'); }
        finally { setLoading(false); }
    }, [query]);
    useEffect(() => { load(); }, [load]);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setQuery(search); }}
                    placeholder="搜索数据集名称或描述…"
                    className="flex-1 px-4 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                <button onClick={() => setQuery(search)} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700">搜索</button>
                <button onClick={() => { setSearch(''); setQuery(''); }} className="px-3 py-2 text-slate-400 border border-slate-200 rounded-xl hover:bg-slate-50"><X className="w-4 h-4" /></button>
            </div>
            {!loading && <p className="text-xs text-slate-400">共 {datasets.length} 个数据集（含私有）</p>}
            {loading && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-indigo-400" /></div>}
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">{error}</div>}
            {!loading && !error && datasets.map((d) => <DatasetCard key={d.id} dataset={d} isAdmin onUpdated={load} />)}
        </div>
    );
}

// ─── Tailwind 颜色映射 ────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, { active: string; hover: string }> = {
    indigo: { active: 'bg-indigo-600 border-indigo-600 text-white', hover: 'hover:border-indigo-300 hover:text-indigo-600' },
    emerald: { active: 'bg-emerald-600 border-emerald-600 text-white', hover: 'hover:border-emerald-300 hover:text-emerald-600' },
    amber: { active: 'bg-amber-500 border-amber-500 text-white', hover: 'hover:border-amber-300 hover:text-amber-600' },
    violet: { active: 'bg-violet-600 border-violet-600 text-white', hover: 'hover:border-violet-300 hover:text-violet-600' },
    cyan: { active: 'bg-cyan-600 border-cyan-600 text-white', hover: 'hover:border-cyan-300 hover:text-cyan-600' },
};

interface TagSelectorProps {
    category: typeof TAG_CATEGORIES[number];
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
            onChange(category.key, arr.includes(option) ? arr.filter(v => v !== option) : [...arr, option]);
        }
    };
    const isSelected = (option: string) =>
        category.type === 'single' ? value === option : Array.isArray(value) && value.includes(option);
    const typeHint = category.type === 'single'
        ? (lang === 'en' ? 'single' : '单选')
        : (lang === 'en' ? 'multi' : '多选');
    return (
        <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                {getCategoryLabel(category, lang)}
                {category.required && <span className="text-red-400">*</span>}
                <span className="text-xs text-slate-400 font-normal">({typeHint})</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
                {category.options.map((option) => (
                    <button key={option} type="button" onClick={() => handleClick(option)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${isSelected(option) ? colors.active : `bg-white border-slate-200 text-slate-600 ${colors.hover}`}`}>
                        {getOptionLabel(category, option, lang)}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 数据集卡片（可编辑 + 下载）
// ═══════════════════════════════════════════════════════════════════════════════
function DatasetCard({ dataset, isOwner = false, isAdmin = false, onUpdated }:
    { dataset: DatasetListItem; isOwner?: boolean; isAdmin?: boolean; onUpdated?: () => void }) {
    const { lang } = useLang();
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [desc, setDesc] = useState(dataset.description || '');
    const [tagsData, setTagsData] = useState<TagsData>(() => parseTags(dataset.tags));
    const [isPublic, setIsPublic] = useState(dataset.is_public);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [dlMsg, setDlMsg] = useState('');
    const canEdit = isOwner || isAdmin;

    const handleSave = async () => {
        setSaving(true); setSaveMsg('');
        try {
            await updateDataset(dataset.id, { description: desc, tags: serializeTags(tagsData), is_public: isPublic });
            setSaveMsg('✓ 已保存'); setEditing(false); onUpdated?.();
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (e: unknown) { setSaveMsg('❌ ' + ((e as Error).message || '保存失败')); }
        finally { setSaving(false); }
    };

    const handleQuickDownload = async () => {
        setDlMsg('生成链接中…');
        try {
            const { url } = await getDownloadUrl(dataset.id, 'meta/info.json');
            window.open(url, '_blank'); setDlMsg('');
        } catch (e: unknown) { setDlMsg('❌ ' + ((e as Error).message || '获取失败')); setTimeout(() => setDlMsg(''), 4000); }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* 卡片头部 */}
            <div className="flex items-start justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition"
                onClick={() => setExpanded(!expanded)}>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm truncate">{dataset.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {isPublic ? '已公开' : '未公开'}
                        </span>
                        {dataset.version && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">v{dataset.version}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        {dataset.total_episodes != null && <span>{dataset.total_episodes} episodes</span>}
                        {dataset.size_bytes != null && <span>{formatBytes(dataset.size_bytes)}</span>}
                        {isAdmin && dataset.owner_phone && <span>上传者: {dataset.owner_phone}</span>}
                        <span>{dataset.created_at.slice(0, 10)}</span>
                    </div>
                    {dataset.tags && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {flattenTags(parseTags(dataset.tags)).map((item) => (
                                <span key={item.category.key + ':' + item.value} className="text-xs px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600">{item.value}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1.5 ml-3 shrink-0">
                    {canEdit && (
                        <button onClick={(e) => { e.stopPropagation(); setEditing(!editing); setExpanded(true); }}
                            className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition" title="编辑">
                            <Pencil className="w-4 h-4" />
                        </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); handleQuickDownload(); }}
                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition" title="下载 info.json">
                        <Download className="w-4 h-4" />
                    </button>
                    {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </div>

            {dlMsg && <div className="px-5 pb-2 text-xs text-indigo-600">{dlMsg}</div>}

            {/* 展开区域 */}
            <AnimatePresence>
                {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t border-slate-100">
                        <div className="px-5 py-4 space-y-4">
                            {/* 只读详情 */}
                            {!editing && (
                                <div className="space-y-2">
                                    <p className="text-xs text-slate-500">{dataset.description || <span className="italic text-slate-300">暂无描述</span>}</p>
                                    <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                                        {dataset.total_frames != null && <span>总帧数 {dataset.total_frames.toLocaleString()}</span>}
                                        {dataset.robot && <span>机器人 {dataset.robot}</span>}
                                        {dataset.license && <span>协议 {dataset.license}</span>}
                                        {dataset.has_preview && <span className="text-emerald-500">✓ 有预览</span>}
                                    </div>
                                    {canEdit && (
                                        <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 mt-1">
                                            <Pencil className="w-3.5 h-3.5" /> 编辑信息
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* 编辑表单 */}
                            {editing && canEdit && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-700 font-medium">公开状态</span>
                                        <button onClick={() => setIsPublic(!isPublic)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPublic ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                            {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            {isPublic ? '已公开' : '未公开'}
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">描述</label>
                                        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="数据集描述…"
                                            className="w-full px-3 py-2 text-sm text-slate-800 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none" />
                                    </div>
                                    <div>
                                        <p className="block text-xs font-medium text-slate-500 mb-2">标签</p>
                                        <div className="space-y-3">
                                            {TAG_CATEGORIES.map(cat => (
                                                <TagSelector key={cat.key} category={cat}
                                                    value={tagsData[cat.key as keyof TagsData]}
                                                    lang={lang}
                                                    onChange={(k, v) => setTagsData(prev => ({ ...prev, [k]: v }))} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={handleSave} disabled={saving}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 保存
                                        </button>
                                        <button onClick={() => { setEditing(false); setDesc(dataset.description || ''); setTagsData(parseTags(dataset.tags)); setIsPublic(dataset.is_public); }}
                                            className="px-4 py-2 text-sm text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 transition">取消</button>
                                        {saveMsg && <span className={`text-sm ${saveMsg.startsWith('✓') ? 'text-emerald-600' : 'text-red-600'}`}>{saveMsg}</span>}
                                    </div>
                                </motion.div>
                            )}

                            {/* 下载文件区 */}
                            <div className="border-t border-slate-100 pt-3">
                                <p className="text-xs font-medium text-slate-500 mb-2">下载文件</p>
                                <DownloadFileList datasetId={dataset.id} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── 下载文件列表 ──────────────────────────────────────────────────────────────
const COMMON_FILES = [
    { label: 'info.json（元信息）', path: 'meta/info.json' },
    { label: 'stats.json（统计）', path: 'meta/stats.json' },
    { label: 'episodes_stats.jsonl', path: 'meta/episodes_stats.jsonl' },
];

function DownloadFileList({ datasetId }: { datasetId: string }) {
    const [loading, setLoading] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    const download = async (file: string) => {
        setLoading(file); setMsg('');
        try {
            const { url } = await getDownloadUrl(datasetId, file);
            window.open(url, '_blank');
        } catch (e: unknown) { setMsg('❌ ' + ((e as Error).message || '获取失败')); setTimeout(() => setMsg(''), 4000); }
        finally { setLoading(null); }
    };

    return (
        <div className="space-y-1">
            {COMMON_FILES.map(({ label, path }) => (
                <button key={path} onClick={() => download(path)} disabled={loading === path}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-sm text-slate-600 hover:text-indigo-700 transition disabled:opacity-60">
                    {loading === path ? <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" /> : <Download className="w-3.5 h-3.5 shrink-0 text-indigo-400" />}
                    {label}
                </button>
            ))}
            {msg && <p className="text-xs text-red-600 px-3">{msg}</p>}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 更换手机号表单
// ═══════════════════════════════════════════════════════════════════════════════
function ChangePhoneForm({ onSuccess }: { onSuccess: () => void }) {
    const [newPhone, setNewPhone] = useState('');
    const [captchaId, setCaptchaId] = useState('');
    const [captchaImg, setCaptchaImg] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [step, setStep] = useState<'form' | 'sms'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { countdown, start: startCountdown } = useCountdown();

    const fetchCaptcha = async () => {
        try {
            const res = await getCaptcha();
            setCaptchaId(res.captcha_id); setCaptchaImg(res.image_base64); setCaptchaText('');
        } catch {
            // 后端不可达时静默失败，用户可点刷新按钮重试
        }
    };
    useEffect(() => { void fetchCaptcha(); }, []);

    const handleSendSms = async () => {
        setError('');
        if (!newPhone || newPhone.length !== 11) { setError('请输入正确的手机号'); return; }
        if (!captchaText) { setError('请输入图形验证码'); return; }
        setLoading(true);
        try { await sendSms(newPhone, captchaId, captchaText, 'change_phone'); setStep('sms'); startCountdown(); }
        catch (e: unknown) { setError((e as Error).message || '发送失败'); void fetchCaptcha(); }
        finally { setLoading(false); }
    };

    const handleConfirm = async () => {
        setError('');
        if (!smsCode || smsCode.length !== 6) { setError('请输入6位验证码'); return; }
        setLoading(true);
        try { await changePhone(newPhone, smsCode); setSuccess('手机号已更换，请重新登录以刷新信息。'); setTimeout(() => onSuccess(), 2000); }
        catch (e: unknown) {
            const msg = (e as Error).message || '更换失败';
            setError(msg.includes('fetch') ? '网络异常，请稍后重试（验证码仍有效）' : msg);
        }
        finally { setLoading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}
            {step === 'form' ? (
                <>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">新手机号</label>
                        <input type="tel" maxLength={11} value={newPhone} onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
                            placeholder="请输入新手机号"
                            className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">图形验证码</label>
                        <div className="flex gap-3">
                            <input type="text" maxLength={4} value={captchaText} onChange={(e) => setCaptchaText(e.target.value.toUpperCase())}
                                placeholder="4位验证码"
                                className="flex-1 px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50 font-mono tracking-widest" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {captchaImg && <img src={captchaImg} alt="验证码" className="h-10 rounded-lg border border-slate-200 cursor-pointer" onClick={fetchCaptcha} />}
                            <button type="button" onClick={fetchCaptcha} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><RefreshCw className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <button onClick={handleSendSms} disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />} 获取短信验证码
                    </button>
                </>
            ) : (
                <>
                    <p className="text-sm text-slate-500">验证码已发至 <span className="font-semibold text-slate-700">{newPhone.slice(0, 3)}****{newPhone.slice(7)}</span></p>
                    <input type="text" maxLength={6} value={smsCode} onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="请输入6位验证码" autoFocus
                        className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50 font-mono tracking-widest" />
                    <div className="flex gap-3">
                        <button onClick={handleConfirm} disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} 确认更换
                        </button>
                        {countdown > 0
                            ? <span className="px-4 py-2.5 text-sm text-slate-400 border border-slate-200 rounded-xl">{countdown}s</span>
                            : <button onClick={() => { setStep('form'); fetchCaptcha(); }} className="px-4 text-sm text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50">重新获取</button>}
                    </div>
                </>
            )}
        </motion.div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 重置/设置密码表单
// ═══════════════════════════════════════════════════════════════════════════════
function ResetPasswordForm({ phone, onSuccess }: { phone: string; onSuccess: () => void }) {
    const [captchaId, setCaptchaId] = useState('');
    const [captchaImg, setCaptchaImg] = useState('');
    const [captchaText, setCaptchaText] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<'form' | 'sms'>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { countdown, start: startCountdown } = useCountdown();

    const fetchCaptcha = async () => {
        try {
            const res = await getCaptcha();
            setCaptchaId(res.captcha_id); setCaptchaImg(res.image_base64); setCaptchaText('');
        } catch {
            // 后端不可达时静默失败
        }
    };
    useEffect(() => { void fetchCaptcha(); }, []);

    const handleSendSms = async () => {
        setError('');
        if (!captchaText) { setError('请输入图形验证码'); return; }
        if (!newPassword || newPassword.length < 8) { setError('密码长度不得少于8位'); return; }
        if (newPassword !== confirmPassword) { setError('两次密码输入不一致'); return; }
        setLoading(true);
        try { await sendSms(phone, captchaId, captchaText, 'reset_password'); setStep('sms'); startCountdown(); }
        catch (e: unknown) { setError((e as Error).message || '发送失败'); void fetchCaptcha(); }
        finally { setLoading(false); }
    };

    const handleConfirm = async () => {
        setError('');
        if (!smsCode || smsCode.length !== 6) { setError('请输入6位验证码'); return; }
        setLoading(true);
        try { await resetPassword(phone, smsCode, newPassword); setSuccess('密码已设置成功！'); setTimeout(() => onSuccess(), 2000); }
        catch (e: unknown) {
            const msg = (e as Error).message || '设置失败';
            setError(msg.includes('fetch') ? '网络异常，请稍后重试（验证码仍有效，可直接再试）' : msg);
        }
        finally { setLoading(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            {success && <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>}
            {step === 'form' ? (
                <>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">新密码（至少8位）</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="请输入新密码"
                            className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">确认新密码</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="再次输入新密码"
                            className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">图形验证码</label>
                        <div className="flex gap-3">
                            <input type="text" maxLength={4} value={captchaText} onChange={(e) => setCaptchaText(e.target.value.toUpperCase())}
                                placeholder="4位验证码"
                                className="flex-1 px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50 font-mono tracking-widest" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            {captchaImg && <img src={captchaImg} alt="验证码" className="h-10 rounded-lg border border-slate-200 cursor-pointer" onClick={fetchCaptcha} />}
                            <button type="button" onClick={fetchCaptcha} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><RefreshCw className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">验证码将发至 {phone.slice(0, 3)}****{phone.slice(7)}</p>
                    <button onClick={handleSendSms} disabled={loading}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />} 获取短信验证码
                    </button>
                </>
            ) : (
                <>
                    <p className="text-sm text-slate-500">验证码已发至 <span className="font-semibold text-slate-700">{phone.slice(0, 3)}****{phone.slice(7)}</span></p>
                    <input type="text" maxLength={6} value={smsCode} onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="请输入6位验证码" autoFocus
                        className="w-full px-4 py-2.5 text-sm text-slate-800 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-slate-50 font-mono tracking-widest" />
                    <div className="flex gap-3">
                        <button onClick={handleConfirm} disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} 确认设置
                        </button>
                        {countdown > 0
                            ? <span className="px-4 py-2.5 text-sm text-slate-400 border border-slate-200 rounded-xl">{countdown}s</span>
                            : <button onClick={() => { setStep('form'); fetchCaptcha(); }} className="px-4 text-sm text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50">重新获取</button>}
                    </div>
                </>
            )}
        </motion.div>
    );
}
