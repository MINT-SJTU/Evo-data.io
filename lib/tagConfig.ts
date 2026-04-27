/**
 * 数据集 Tag 配置文件 —— 唯一数据源
 *
 * 设计原则：
 * - options 中的值为英文 key，用于 DB 存储和前后端传输
 * - optionLabels 提供 zh / en 两套展示文案，UI 按语言切换
 * - 新增 tag：在 options 追加 key，在 optionLabels 追加翻译
 */

export type TagCategoryType = 'single' | 'multi';

export interface TagCategory {
    key: string;           // DB/API 存储键
    label: string;         // 分类中文标签
    labelEn: string;       // 分类英文标签
    type: TagCategoryType;
    required: boolean;
    options: string[];     // option 英文 key（存入 DB）
    optionLabels: Record<string, { zh: string; en: string }>;
    color: string;
}

/**
 * 所有 tag 分类定义。
 * key 必须唯一且不可修改（已存储到数据库的 JSON key）。
 * options 使用英文 key 存储，optionLabels 提供 zh/en 展示文案。
 */
export const TAG_CATEGORIES: TagCategory[] = [
    {
        key: 'robot_type',
        label: '本体类型',
        labelEn: 'Robot Type',
        type: 'single',
        required: false,
        options: ['SO100', 'SO101', 'Piper', 'UR5', 'Franka-Panda', 'xArm6'],
        optionLabels: {
            'SO100': { zh: 'SO100', en: 'SO100' },
            'SO101': { zh: 'SO101', en: 'SO101' },
            'Piper': { zh: 'Piper', en: 'Piper' },
            'UR5': { zh: 'UR5', en: 'UR5' },
            'Franka-Panda': { zh: 'Franka-Panda', en: 'Franka-Panda' },
            'xArm6': { zh: 'xArm6', en: 'xArm6' },
        },
        color: 'indigo',
    },
    {
        key: 'task_type',
        label: '任务类型',
        labelEn: 'Task Type',
        type: 'single',
        required: false,
        options: [
            'industrial_assembly',
            'retail_display',
            'hospitality',
            'food_service',
            'home_daily',
            'medical_assist',
            'research',
            'education',
            'simple_test',
        ],
        optionLabels: {
            'industrial_assembly': { zh: '工业生产装配', en: 'Industrial Assembly' },
            'retail_display': { zh: '商业零售与陈列', en: 'Retail & Display' },
            'hospitality': { zh: '酒店服务', en: 'Hospitality' },
            'food_service': { zh: '食品与餐饮', en: 'Food & Catering' },
            'home_daily': { zh: '家庭生活', en: 'Home & Daily Life' },
            'medical_assist': { zh: '医疗助理', en: 'Medical Assistance' },
            'research': { zh: '专业科研', en: 'Research & Science' },
            'education': { zh: '教育场景', en: 'Education' },
            'simple_test': { zh: '简单测试验证', en: 'Simple Test & Validation' },
        },
        color: 'emerald',
    },
    {
        key: 'other',
        label: '其他标签',
        labelEn: 'Other Tags',
        type: 'multi',
        required: false,
        options: ['dual_arm', 'flexible_objects', 'mobile_base'],
        optionLabels: {
            'dual_arm': { zh: '双臂操作', en: 'Dual-Arm' },
            'flexible_objects': { zh: '柔性物体', en: 'Flexible Objects' },
            'mobile_base': { zh: '可移动本体', en: 'Mobile Base' },
        },
        color: 'amber',
    },
    {
        key: 'data_type',
        label: '数据类型',
        labelEn: 'Data Type',
        type: 'single',
        required: false,
        options: ['standard_operation', 'evo_rl'],
        optionLabels: {
            'standard_operation': { zh: '标准操作数据', en: 'Standard Operation' },
            'evo_rl': { zh: 'Evo-RL 数据', en: 'Evo-RL Data' },
        },
        color: 'violet',
    },
    {
        key: 'data_format',
        label: '数据格式',
        labelEn: 'Data Format',
        type: 'single',
        required: false,
        options: ['LeRobot 2.1', 'LeRobot 3.0'],
        optionLabels: {
            'LeRobot 2.1': { zh: 'LeRobot 2.1', en: 'LeRobot 2.1' },
            'LeRobot 3.0': { zh: 'LeRobot 3.0', en: 'LeRobot 3.0' },
        },
        color: 'cyan',
    },
];

/** key → category 的快速查找映射 */
export const TAG_CATEGORY_MAP: Record<string, TagCategory> = Object.fromEntries(
    TAG_CATEGORIES.map((c) => [c.key, c])
);

export interface TagsData {
    robot_type?: string;
    task_type?: string;
    other?: string[];
    data_type?: string;
    data_format?: string;
    [key: string]: string | string[] | undefined;
}

// ─── 展示标签辅助函数 ─────────────────────────────────────────────────────────

/** 获取某 category 的展示标签 */
export function getCategoryLabel(category: TagCategory, lang: 'zh' | 'en'): string {
    return lang === 'en' ? category.labelEn : category.label;
}

/** 获取某 option value 的展示标签 */
export function getOptionLabel(category: TagCategory, value: string, lang: 'zh' | 'en'): string {
    return category.optionLabels[value]?.[lang] ?? value;
}

// ─── 序列化 / 反序列化 ────────────────────────────────────────────────────────

/** 将 DB 中存储的 JSON 字符串反序列化为 TagsData */
export function parseTags(tagsStr: string | null | undefined): TagsData {
    if (!tagsStr) return {};
    try {
        const parsed = JSON.parse(tagsStr);
        if (typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as TagsData;
    } catch { /* 旧格式兼容 */ }
    return {};
}

/** 将 TagsData 序列化为 JSON 字符串存入 DB */
export function serializeTags(tags: TagsData): string {
    const clean: TagsData = {};
    for (const [k, v] of Object.entries(tags)) {
        if (v === undefined || v === null || v === '') continue;
        if (Array.isArray(v) && v.length === 0) continue;
        clean[k] = v;
    }
    return JSON.stringify(clean);
}

// ─── 展平工具 ─────────────────────────────────────────────────────────────────

export interface FlatTag {
    key: string;
    value: string;      // 存储的英文 key
    displayZh: string;  // 中文展示
    displayEn: string;  // 英文展示
    category: TagCategory;
}

/** 将 TagsData 展平为标签列表，供 UI 渲染 */
export function flattenTags(tags: TagsData): FlatTag[] {
    const result: FlatTag[] = [];
    for (const cat of TAG_CATEGORIES) {
        const val = tags[cat.key];
        if (!val) continue;
        const values = Array.isArray(val) ? val : [val];
        for (const v of values) {
            result.push({
                key: cat.key,
                value: v,
                displayZh: cat.optionLabels[v]?.zh ?? v,
                displayEn: cat.optionLabels[v]?.en ?? v,
                category: cat,
            });
        }
    }
    return result;
}
