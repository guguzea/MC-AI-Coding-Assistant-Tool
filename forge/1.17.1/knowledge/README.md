# Minecraft Modding 知识库

> AI 在生成代码前，应先阅读本知识库中相关文档以获取背景知识。

## 知识层级说明

本目录是**跨平台通用知识库**，与 `AGENTS.md`、`.cursor/rules/` 的分工如下：

```
forge/1.17.1/
├── .cursor/rules/00-10      ← 技术领域正面教程（版本专属）
├── AGENTS.md / CLAUDE.md   ← AI 入口总纲
└── knowledge/              ← 跨平台反模式知识库（单一来源）
    ├── antipatterns/     ← 按症状分类（症状 → 根因 → 正确方案）
    ├── common/           ← 通用格式速查（数据包/资源包/术语）
    ├── porting/          ← 跨平台/跨版本移植指南
    └── version-changes/  ← 版本变更记录
```

**使用场景：**
- 需要知道"怎么做" → 读 `.cursor/rules/XX-*.mdc`
- 需要知道"哪里容易错" → 读 `knowledge/antipatterns/*.md`
- 需要跨平台通用知识 → 读 `knowledge/porting/`、`knowledge/common/`

## 目录

```
knowledge/
├── README.md                        # 本文件
├── antipatterns/                    # 反模式库（按症状分类）
│   ├── registry.md                # 注册相关
│   ├── item.md                    # 物品/工具相关
│   ├── entity.md                  # 实体相关
│   ├── block.md                   # 方块相关
│   ├── events.md                  # 事件系统相关
│   ├── networking.md              # 网络通信相关
│   └── gradle.md                  # Gradle 构建相关
├── common/                         # 通用文档
│   ├── glossary.md                # 术语表
│   ├── datapack-format.md         # 数据包格式速查
│   └── resourcepack-format.md    # 资源包格式速查
├── porting/                        # 跨平台/跨版本移植
│   ├── 00-porting-guide.md
│   ├── 01-api-cross-loader.md
│   ├── 02-version-migration.md
│   └── 03-real-world-examples.md
└── version-changes/                # 版本变更记录
    ├── 1.20.x.md
    └── 1.19.x.md
```

## 使用方式

当 AI 需要生成以下内容时，自动读取对应文档：

| 生成内容 | 先读文档 |
|---------|---------|
| 数据包 JSON | `common/datapack-format.md` |
| 资源包 | `common/resourcepack-format.md` |
| 注册失败崩溃 | `antipatterns/registry.md` |
| 物品/工具 API | `antipatterns/item.md` |
| 实体行为异常 | `antipatterns/entity.md` |
| 方块/BlockEntity 崩溃 | `antipatterns/block.md` |
| 事件不触发 | `antipatterns/events.md` |
| 客户端/服务端数据不同步 | `antipatterns/networking.md` |
| Gradle 构建错误 | `antipatterns/gradle.md` |
| 从旧版迁移 | `version-changes/1.19.x.md` |
| 跨平台移植 | `porting/00-porting-guide.md` |

## 阶段里程碑

| 阶段 | 状态 | 说明 |
|-----|------|------|
| Phase 1 | ✅ 完成 | 知识库基础结构 |
| Phase 2 | 🚧 实施中 | 持续补充反模式条目 |
| Phase 3 | 📋 规划中 | 与 MCP Server 联动（工具自动推荐相关反模式） |
