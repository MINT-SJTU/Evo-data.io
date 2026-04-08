// ─── Navbar ───────────────────────────────────────────────
export const navT = {
    en: {
        links: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Datasets', href: '/datasets' },
            { label: 'Guide', href: '/guide' },
        ],
        cta: 'Explore Data',
    },
    zh: {
        links: [
            { label: '首页', href: '/' },
            { label: '关于', href: '/about' },
            { label: '数据集', href: '/datasets' },
            { label: '使用指南', href: '/guide' },
        ],
        cta: '浏览数据',
    },
};

// ─── Hero ─────────────────────────────────────────────────
export const heroT = {
    en: {
        badge: 'Real-World RL Data Platform',
        title1: 'The Data',
        title2: 'Foundation',
        title3: 'for Real-World RL',
        subtitle:
            'Discover, access, and contribute high-quality real-world reinforcement learning datasets. Accelerate sim-to-real transfer and on-robot policy training with standardized, curated data.',
        statLabels: ['Datasets', 'Trajectories', 'Data Volume', 'Tasks'],
        cta1: 'Explore Datasets',
        cta2: 'View Demo',
        scroll: 'Scroll',
    },
    zh: {
        badge: '真实世界 RL 数据平台',
        title1: '真机强化学习',
        title2: '数据基础设施',
        title3: '加速机器人研究',
        subtitle:
            '发现、获取并贡献高质量的真实世界强化学习数据集。以标准化、精心策划的数据加速 Sim-to-Real 迁移与机器人在线策略训练。',
        statLabels: ['数据集', '轨迹数', '数据量', '任务数'],
        cta1: '浏览数据集',
        cta2: '查看演示',
        scroll: '向下滚动',
    },
};

// ─── Home Page ────────────────────────────────────────────
export const homeT = {
    en: {
        featuresBadge: 'Platform Capabilities',
        featuresTitle: 'Everything You Need for ',
        featuresTitleHighlight: 'Real-World RL',
        featuresSubtitle:
            'A unified platform designed specifically for real-world reinforcement learning data — from collection to training.',
        features: [
            {
                title: 'Large-Scale Dataset Hosting',
                description:
                    'Store and serve real-world trajectory datasets from gigabytes to terabytes with optimized delivery pipelines and Alibaba Cloud OSS backend.',
            },
            {
                title: 'Real-World RL Data Support',
                description:
                    'Native support for the LeRobot format used by Evo-RL. All datasets are directly loadable into modern RL training frameworks without any conversion.',
            },
            {
                title: 'Efficient Data Pipeline',
                description:
                    'Stream datasets directly into your RL training scripts. Built-in compatibility with LeRobot, PyTorch DataLoader, and Hugging Face Datasets.',
            },
            {
                title: 'Trajectory Visualization',
                description:
                    'Explore robot trajectories, joint states, reward signals, and sensor readings with interactive visualization tools in your browser.',
            },
            {
                title: 'Open & Standardized',
                description:
                    'All datasets follow standardized metadata schemas. Clear licensing (CC BY, MIT, Apache) for academic research and commercial use.',
            },
            {
                title: 'Community Driven',
                description:
                    'Upload your own real-world datasets, submit benchmarks, and collaborate with the global robot learning research community.',
            },
        ],
        datasetsBadge: 'Featured Datasets',
        datasetsTitle: 'Curated ',
        datasetsTitleHighlight: 'Real-World',
        datasetsTitleSuffix: ' RL Datasets',
        datasetsSubtitle:
            'Explore our growing collection of real-world reinforcement learning datasets, from dexterous manipulation to legged locomotion.',
        viewAll: 'View All Datasets',
        visionBadge: 'Platform Vision',
        visionTitle: 'Bridging the ',
        visionTitleHighlight: 'Sim-to-Real',
        visionTitleSuffix: ' Gap with Data',
        visionDesc:
            'Real-world data scarcity is one of the biggest bottlenecks in robot learning research. EvoData provides a unified, standardized, and accessible platform to accelerate on-robot RL by making high-quality real-world trajectory data freely available.',
        visionPoints: [
            'LeRobot-compatible format — collected directly via Evo-RL',
            'One-click dataset access from RL training scripts',
            'Community-driven data curation and benchmarks',
            'Future: real-time upload, streaming and on-robot data collection tools',
        ],
        visionLink: 'Learn More About Our Roadmap',
        demoBadge: 'Live Demo',
        demoTitle: 'See Evo-RL in Action',
        demoDesc: 'Real-world trajectory rollouts from our Evo-RL training framework — showcasing reward-based success and failure cases.',
        demoSuccessLabel: 'value_success — reward ✓',
        demoFailureLabel: 'value_failure — reward ✗',
        ctaTitle: 'Ready to ',
        ctaTitleHighlight: 'Explore?',
        ctaSubtitle:
            'Browse our curated collection of real-world RL datasets and start accelerating your research today.',
        ctaBtn1: 'Browse Datasets',
        ctaBtn2: 'About the Project',
    },
    zh: {
        featuresBadge: '平台能力',
        featuresTitle: '真实世界 RL 研究所需的',
        featuresTitleHighlight: '一切',
        featuresSubtitle: '专为真实世界强化学习数据设计的统一平台 —— 从数据采集到模型训练，一站式支持。',
        features: [
            {
                title: '大规模数据集托管',
                description: '支持从 GB 到 TB 级别的真实世界轨迹数据集存储与分发，依托阿里云 OSS 后端提供高速访问。',
            },
            {
                title: '真实世界 RL 数据原生支持',
                description: '原生支持 Evo-RL 采用的 LeRobot 格式。所有数据集无需转换即可直接加载到现代 RL 训练框架中。',
            },
            {
                title: '高效数据管线',
                description: '直接将数据集流式传输至 RL 训练脚本，内置兼容 LeRobot、PyTorch DataLoader 和 Hugging Face Datasets。',
            },
            {
                title: '轨迹可视化',
                description: '在浏览器中交互式探索机器人轨迹、关节状态、奖励信号和传感器数据。',
            },
            {
                title: '开放与标准化',
                description: '所有数据集遵循统一的元数据规范，采用 LeRobot 格式，提供清晰的开源许可（Apache 2.0），支持学术与商业使用。',
            },
            {
                title: '社区驱动',
                description: '上传您自己的真实世界数据集、提交基准测试，与全球机器人学习研究社区共同协作。',
            },
        ],
        datasetsBadge: '精选数据集',
        datasetsTitle: '精心策划的',
        datasetsTitleHighlight: '真机强化学习',
        datasetsTitleSuffix: '数据集',
        datasetsSubtitle: '探索我们不断增长的真实世界强化学习数据集合，从灵巧操作到足式机器人运动，应有尽有。',
        viewAll: '查看全部数据集',
        visionBadge: '平台愿景',
        visionTitle: '用数据弥合',
        visionTitleHighlight: 'Sim-to-Real',
        visionTitleSuffix: '鸿沟',
        visionDesc:
            '真实世界数据的匮乏是机器人学习研究面临的最大瓶颈之一。EvoData 提供统一、标准化且易于访问的平台，通过开放高质量真实世界轨迹数据，加速真实世界强化学习的研究进程。',
        visionPoints: [
            'LeRobot 兼容格式 — 通过 Evo-RL 直接采集',
            '一键从 RL 训练脚本访问数据集',
            '社区驱动的数据策划与基准测试',
            '未来：实时上传、流式传输与真实世界数据采集工具',
        ],
        visionLink: '了解更多路线图',
        demoBadge: '实时演示',
        demoTitle: '查看 Evo-RL 实机效果',
        demoDesc: '来自 Evo-RL 训练框架的真实世界轨迹 rollout 展示 — 呈现基于奖励的成功与失败案例。',
        demoSuccessLabel: 'value_success — 奖励 ✓',
        demoFailureLabel: 'value_failure — 奖励 ✗',
        ctaTitle: '准备好开始',
        ctaTitleHighlight: '探索了吗？',
        ctaSubtitle: '浏览我们精心整理的真实世界 RL 数据集，立即加速您的研究。',
        ctaBtn1: '浏览数据集',
        ctaBtn2: '关于项目',
    },
};

// ─── About Page ───────────────────────────────────────────
export const aboutT = {
    en: {
        headerBadge: 'About the Project',
        headerTitle1: 'Building the ',
        headerTitleHighlight: 'Complete Ecosystem',
        headerTitle2: 'for Real-World RL',
        headerDesc:
            'EvoData is an open data platform developed by EvoMind Tech and MINT Lab, SJTU. We are dedicated to building a complete ecosystem — from real-world RL methodology to data collection and community sharing — to accelerate intelligent embodied AI.',
        problemBadge: 'The Problem',
        problemTitle: 'Why Does This Platform Exist?',
        problemDesc:
            'Real-world reinforcement learning faces unique data challenges that existing platforms are not designed to address.',
        problems: [
            {
                title: 'Real-World RL Data is Scarce',
                description:
                    'Unlike simulation data, high-quality real-world RL trajectory data is extremely rare. Collecting it requires physical robots, safety-critical RL training, and significant engineering effort.',
            },
            {
                title: 'VLA Models Need RL-Quality Data',
                description:
                    'Vision-Language-Action models rely on reinforcement learning for fine-grained, stable control. Without diverse real-world RL data, VLA policies fail to generalize beyond toy tasks.',
            },
            {
                title: 'No Unified Standard',
                description:
                    'Datasets are scattered across institutions with incompatible formats, making reproducibility and cross-dataset training nearly impossible.',
            },
        ],
        featuresBadge: 'Platform Features',
        featuresTitle: 'What EvoData Offers',
        featuresDesc:
            'A comprehensive data infrastructure platform purpose-built for real-world reinforcement learning research.',
        capabilities: [
            'Datasets collected via Evo-RL — our real-world RL training framework',
            'LeRobot-compatible format for direct integration with modern RL pipelines',
            'Unified metadata schema across all datasets',
            'Built-in trajectory visualization and data exploration tools',
            'Versioned datasets with full provenance tracking',
            'Open Apache 2.0 licensing for research and commercial use',
            'Community-driven dataset curation and quality control',
            'Benchmarking suite for policy evaluation on real robots',
        ],
        roadmapBadge: 'Development Roadmap',
        roadmapTitle: 'Building a Complete Ecosystem',
        roadmapDesc:
            'From a static showcase to a full real-world RL ecosystem — spanning methodology, data collection, and community sharing.',
        roadmap: [
            {
                title: 'Static Showcase',
                desc: 'Static website showcasing the platform vision, dataset previews, and the Evo-RL project roadmap.',
                items: ['Platform overview & vision', 'Dataset catalog with preview data', 'Design system & component library'],
            },
            {
                title: 'Dataset Browsing & Preview',
                desc: 'Full dataset browsing with real metadata, trajectory previews, and search functionality.',
                items: ['Real dataset metadata API', 'Full-text search & tag filtering', 'Trajectory visualization', 'Dataset detail pages'],
            },
            {
                title: 'Upload & Download',
                desc: 'Enable the community to upload and download real-world RL datasets with authentication and cloud storage.',
                items: ['User authentication system', 'Dataset upload pipeline', 'Chunked download with resume', 'Alibaba Cloud OSS integration'],
            },
            {
                title: 'Community & Ecosystem',
                desc: 'A full ecosystem integrating real-world RL methods, data collection, sharing, and community benchmarking.',
                items: ['Community dataset contributions', 'Policy evaluation benchmarks', 'Evo-RL method integration', 'Open API access'],
            },
        ],
        teamBadge: 'Our Team',
        teamTitle: 'Built by EvoMind Tech & MINT Lab, SJTU',
        teamDesc:
            'EvoData is jointly developed by EvoMind Tech and MINT Lab at Shanghai Jiao Tong University — combining industry engineering with academic research to advance real-world robot learning.',
        teamTags: ['EvoMind Tech', 'SJTU MINT Lab', 'Open Source'],
        statusLabels: { current: 'In Progress', upcoming: 'Upcoming', planned: 'Planned', future: 'Future' },
    },
    zh: {
        headerBadge: '关于项目',
        headerTitle1: '构建真实世界强化学习的',
        headerTitleHighlight: '完整生态体系',
        headerTitle2: '',
        headerDesc:
            'EvoData 是由物智进化（EvoMind Tech）与上海交通大学 MINT 实验室联合开发的开放数据平台。我们致力于构建从真实世界强化学习方法到数据收集、社区共享的完整生态体系，加速具身智能的发展。',
        problemBadge: '问题背景',
        problemTitle: '为什么需要这个平台？',
        problemDesc: '真实世界强化学习面临独特的数据挑战，而现有平台并非为此而设计。',
        problems: [
            {
                title: '真实世界强化学习数据极度稀缺',
                description: '与仿真数据不同，高质量的真实世界 RL 轨迹数据极其罕见。收集它需要真实机器人、安全关键的 RL 训练流程以及大量工程投入。',
            },
            {
                title: 'VLA 模型依赖高质量 RL 数据',
                description: 'Vision-Language-Action 模型依赖强化学习来实现更精细、更稳定的控制。缺乏多样化的真实世界 RL 数据，VLA 策略难以泛化到真实任务场景。',
            },
            {
                title: '缺乏统一标准',
                description: '数据集分散于各机构，格式互不兼容，使跨数据集训练和复现研究几乎无法实现。',
            },
        ],
        featuresBadge: '平台特性',
        featuresTitle: 'EvoData 提供什么',
        featuresDesc: '专为真实世界强化学习研究构建的综合数据基础设施平台。',
        capabilities: [
            '数据集通过 Evo-RL（真实世界 RL 训练框架）采集',
            '兼容 LeRobot 格式，可直接集成到现代 RL 训练管线',
            '所有数据集统一元数据规范',
            '内置轨迹可视化与数据探索工具',
            '带完整溯源追踪的版本化数据集',
            '开放 Apache 2.0 许可，支持学术与商业使用',
            '社区驱动的数据集策划与质量管控',
            '真实世界策略评估基准测试套件',
        ],
        roadmapBadge: '开发路线图',
        roadmapTitle: '构建完整生态体系',
        roadmapDesc: '从静态展示到涵盖方法论、数据收集与社区共享的完整真实世界 RL 生态系统。',
        roadmap: [
            {
                title: '静态展示',
                desc: '静态网站，展示平台愿景、数据集预览及 Evo-RL 项目路线图。',
                items: ['平台概览与愿景', '模拟数据的数据集目录', '设计系统与组件库'],
            },
            {
                title: '数据集浏览与预览',
                desc: '基于真实元数据的完整数据集浏览、轨迹预览与搜索功能。',
                items: ['真实数据集元数据 API', '全文搜索与标签筛选', '轨迹可视化', '数据集详情页'],
            },
            {
                title: '上传与下载',
                desc: '支持社区在身份验证后上传和下载真实世界 RL 数据集，接入云存储。',
                items: ['用户身份验证系统', '数据集上传管线', '断点续传下载', '阿里云 OSS 集成'],
            },
            {
                title: '社区与生态整合',
                desc: '整合真实世界 RL 方法、数据收集、共享与社区基准评测的完整生态体系。',
                items: ['社区数据集贡献', '策略评估基准', 'Evo-RL 方法集成', '开放 API 接口'],
            },
        ],
        teamBadge: '我们的团队',
        teamTitle: '物智进化 & 上交大 MINT 实验室联合出品',
        teamDesc: 'EvoData 由物智进化与上海交通大学 MINT 实验室联合开发，将产业工程实践与学术研究相结合，共同推动真实世界机器人学习的发展。',
        teamTags: ['物智进化', '上交大 MINT 实验室', '开源'],
        statusLabels: { current: '进行中', upcoming: '即将推出', planned: '规划中', future: '未来计划' },
    },
};

// ─── Datasets Page ────────────────────────────────────────
export const datasetsT = {
    en: {
        badge: 'Dataset Catalog',
        title1: 'Explore ',
        titleHighlight: 'Datasets',
        desc: 'Browse our curated collection of real-world reinforcement learning datasets. All datasets are collected via Evo-RL and formatted in LeRobot standard for seamless integration.',
        searchPlaceholder: 'Search datasets, robots, tasks...',
        found: 'datasets found',
        comingSoon: 'Download Coming Soon',
        noResults: 'No datasets match your search',
        noResultsHint: 'Try a different keyword or remove the tag filter.',
        clearFilters: 'Clear filters',
        tags: ['Manipulation', 'Navigation', 'Locomotion', 'Dexterous', 'Humanoid', 'Assembly', 'Mobile', 'RL', 'Real-World'],
        allLabel: 'All',
    },
    zh: {
        badge: '数据集目录',
        title1: '探索',
        titleHighlight: '数据集',
        desc: '浏览基于 Evo-RL 收集的真实世界强化学习数据集。所有数据集采用 LeRobot 标准格式，可直接集成到您的 RL 训练管线中。',
        searchPlaceholder: '搜索数据集、机器人、任务...',
        found: '个数据集',
        comingSoon: '下载功能即将上线',
        noResults: '没有匹配的数据集',
        noResultsHint: '请尝试其他关键词或取消标签筛选。',
        clearFilters: '清除筛选',
        tags: ['Manipulation', 'Navigation', 'Locomotion', 'Dexterous', 'Humanoid', 'Assembly', 'Mobile', 'RL', 'Real-World'],
        allLabel: '全部',
    },
};

// ─── Dataset Card ─────────────────────────────────────────
export const datasetCardT = {
    en: {
        tasks: 'Tasks',
        trajectories: 'Trajectories',
        details: 'Details',
        download: 'Download',
    },
    zh: {
        tasks: '任务数',
        trajectories: '轨迹数',
        details: '详情',
        download: '下载',
    },
};

// ─── Dataset Detail ───────────────────────────────────────
export const detailT = {
    en: {
        back: 'Back to Datasets',
        about: 'About this Dataset',
        aboutSuffix: ' This dataset is designed for training and evaluating robot learning policies. It includes diverse scenarios and environmental conditions to improve policy generalization.',
        warningTitle: 'Download Coming Soon',
        warningDesc: 'Dataset download functionality is coming soon. For early access, please contact us via email.',
        downloadBtn: 'Download (Coming Soon)',
        infoTitle: 'Dataset Info',
        relatedTitle: 'Related Datasets',
        labels: { Size: 'Size', Tasks: 'Tasks', Robot: 'Robot', Format: 'Format', License: 'License', Trajectories: 'Trajectories' },
    },
    zh: {
        back: '返回数据集列表',
        about: '数据集简介',
        aboutSuffix: ' 该数据集专为机器人学习策略的训练与评估而设计，涵盖多样化的场景和环境条件，有助于提升策略的泛化能力。',
        warningTitle: '下载功能即将上线',
        warningDesc: '数据集下载功能即将推出。如需提前访问，请通过邮件联系我们。',
        downloadBtn: '下载（即将推出）',
        infoTitle: '数据集信息',
        relatedTitle: '相关数据集',
        labels: { Size: '大小', Tasks: '任务数', Robot: '机器人', Format: '格式', License: '许可证', Trajectories: '轨迹数' },
    },
};

// ─── Guide Page ───────────────────────────────────────────
export const guideT = {
    en: {
        badge: 'Documentation',
        title: 'Guide & Documentation',
        desc: 'Comprehensive documentation and guides for the EvoData platform are currently in progress. They will be available soon.',
        wipTitle: 'Full Documentation Coming Soon',
        wipDesc: 'The complete documentation — including SDK usage, API reference, and dataset format specs — is under active development and will be released soon.',
        browseDatasetsBtn: 'Browse Datasets',
        githubBtn: 'Follow on GitHub',
        featuresTitle: 'What Documentation Will Cover',
        featuresSubtitle: 'Planned documentation topics for the EvoData platform.',
        features: [
            { title: 'Getting Started Guide', desc: 'Step-by-step tutorial to access and use EvoData real-world RL datasets in your training pipeline.' },
            { title: 'Evo-RL Integration', desc: 'How datasets were collected via Evo-RL and how to reproduce experiments with the same setup.' },
            { title: 'LeRobot Format Reference', desc: 'Detailed specification of the LeRobot dataset format used across all EvoData datasets.' },
            { title: 'Dataset Contribution Guide', desc: 'How to contribute your own real-world RL datasets to the EvoData community platform.' },
        ],
        quickStartTitle: 'Quick Start',
        installLabel: 'Install',
        exampleLabel: 'Example Usage',
    },
    zh: {
        badge: '文档中心',
        title: '使用指南与文档',
        desc: 'EvoData 平台的完整文档与使用指南正在积极编写中，即将发布。',
        wipTitle: '完整文档即将上线',
        wipDesc: '包括 SDK 使用、API 参考和数据集格式规范在内的完整文档正在开发中，敬请期待。',
        browseDatasetsBtn: '浏览数据集',
        githubBtn: '关注 GitHub',
        featuresTitle: '文档将涵盖的内容',
        featuresSubtitle: 'EvoData 平台计划中的文档主题。',
        features: [
            { title: '快速上手指南', desc: '逐步教程，帮助您在训练管线中访问和使用 EvoData 真机 RL 数据集。' },
            { title: 'Evo-RL 集成说明', desc: '介绍数据集如何通过 Evo-RL 收集，以及如何用相同配置复现实验。' },
            { title: 'LeRobot 格式参考', desc: 'EvoData 所有数据集使用的 LeRobot 数据集格式的详细规范说明。' },
            { title: '数据集贡献指南', desc: '如何向 EvoData 社区平台贡献您自己的真机 RL 数据集。' },
        ],
        quickStartTitle: '快速开始',
        installLabel: '安装',
        exampleLabel: '使用示例',
    },
};// ─── Footer ───────────────────────────────────────────────
export const footerT = {
    en: {
        desc: 'An open data platform for real-world reinforcement learning. Empowering the community with high-quality, standardized trajectory datasets.',
        groups: [
            {
                title: 'Platform',
                links: [
                    { label: 'Home', href: '/' },
                    { label: 'Datasets', href: '/datasets' },
                    { label: 'About', href: '/about' },
                    { label: 'Guide', href: '/guide' },
                ],
            },
            {
                title: 'Resources',
                links: [
                    { label: 'Documentation', href: '/guide' },
                    { label: 'Data Format', href: '/guide' },
                    { label: 'API Reference', href: '/guide' },
                    { label: 'Changelog', href: '/about' },
                ],
            },
            {
                title: 'Community',
                links: [
                    { label: 'GitHub', href: 'https://github.com/MINT-SJTU', external: true as const },
                    { label: 'Contact Us', href: 'mailto:contact@evo-data.io', external: true as const },
                    { label: 'MINT Lab', href: 'https://github.com/MINT-SJTU', external: true as const },
                ],
            },
        ],
        copyright: 'EvoData · EvoMind Tech & MINT Lab, SJTU. All rights reserved.',
        builtWith: 'Built with',
        forRobotics: 'for Real-World RL',
    },
    zh: {
        desc: '面向真实世界强化学习的开放数据平台，为社区提供高质量、标准化的轨迹数据集。',
        groups: [
            {
                title: '平台',
                links: [
                    { label: '首页', href: '/' },
                    { label: '数据集', href: '/datasets' },
                    { label: '关于', href: '/about' },
                    { label: '使用指南', href: '/guide' },
                ],
            },
            {
                title: '资源',
                links: [
                    { label: '文档', href: '/guide' },
                    { label: '数据格式', href: '/guide' },
                    { label: 'API 参考', href: '/guide' },
                    { label: '更新日志', href: '/about' },
                ],
            },
            {
                title: '社区',
                links: [
                    { label: 'GitHub', href: 'https://github.com/MINT-SJTU', external: true as const },
                    { label: '联系我们', href: 'mailto:contact@evo-data.io', external: true as const },
                    { label: 'MINT 实验室', href: 'https://github.com/MINT-SJTU', external: true as const },
                ],
            },
        ],
        copyright: 'EvoData · 物智进化 & 上海交通大学 MINT 实验室。保留所有权利。',
        builtWith: '专为',
        forRobotics: '真实世界强化学习而构建',
    },
};
