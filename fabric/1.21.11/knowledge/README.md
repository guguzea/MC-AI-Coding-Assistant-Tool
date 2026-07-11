# Fabric 1.21.11 知识库

> AI 在生成代码前，应先阅读本知识库中相关文档以获取背景知识。

## 知识层级说明

本目录是 **Fabric 1.21.11 专属知识库**，与 `AGENTS.md`、`.cursor/rules/` 的分工如下：

```
fabric/1.21.11/
├── .cursor/rules/00-10      ← 技术领域正面教程（版本专属）
├── AGENTS.md              ← AI 入口总纲
└── knowledge/             ← Fabric 平台反模式知识库
    ├── antipatterns/     ← 按症状分类（症状 → 根因 → 正确方案）
    ├── common/           ← 通用格式速查（数据包/资源包/术语）
    ├── porting/          ← Forge ↔ Fabric 跨平台移植
    └── version-changes/  ← MC 1.21.x 版本变更记录
```

**使用场景：**
- 需要知道"怎么做" → 读 `.cursor/rules/XX-*.mdc`
- 需要知道"哪里容易错" → 读 `knowledge/antipatterns/*.md`
- 需要跨平台通用知识 → 读 `knowledge/porting/`、`knowledge/common/`

## 目录

```
knowledge/
├── README.md                        # 本文件
├── antipatterns/                    # 反模式库（Fabric 特有）
│   ├── registry.md                # 注册相关
│   ├── mixin.md                   # Mixin 相关（Fabric 独有）
│   ├── yarn-mappings.md           # Yarn 映射相关（Fabric 独有）
│   ├── gradle.md                 # Gradle/Loom 构建相关
│   ├── item.md                   # 物品相关
│   └── networking.md             # 网络通信相关
├── common/                         # 通用文档
│   ├── glossary.md               # 术语表（Yarn 命名约定）
│   └── datapack-format.md        # 数据包格式速查
├── porting/                        # 跨平台移植
│   ├── forge-to-fabric.md       # Forge → Fabric（Fabric 独有）
│   └── fabric-to-forge.md        # Fabric → Forge（Fabric 独有）
└── version-changes/                # 版本变更记录
    └── 1.21.x.md
```

## 使用方式

当 AI 需要生成以下内容时，自动读取对应文档：

| 生成内容 | 先读文档 |
|---------|---------|
| 数据包 JSON | `common/datapack-format.md` |
| 注册失败崩溃 | `antipatterns/registry.md` |
| Mixin 注入失败 | `antipatterns/mixin.md` |
| 方法名困惑（class_XXXX）| `antipatterns/yarn-mappings.md` |
| Loom 构建错误 | `antipatterns/gradle.md` |
| 物品/工具 API | `antipatterns/item.md` |
| 网络通信问题 | `antipatterns/networking.md` |
| Forge 项目迁移到 Fabric | `porting/forge-to-fabric.md` |
| Fabric 项目迁移到 Forge | `porting/fabric-to-forge.md` |
| MC 1.21.x 变更 | `version-changes/1.21.x.md` |
