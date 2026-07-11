# Minecraft Modding 知识库（Forge 1.13.2）

> AI 在生成代码前，应先阅读本知识库中相关文档以获取背景知识。

## 知识层级说明

本目录是**跨平台通用知识库**，与 `AGENTS.md`、`.cursor/rules/` 的分工如下：

```
forge/1.13.2/
├── .cursor/rules/00-10      ← 技术领域正面教程（版本专属）
├── AGENTS.md / CLAUDE.md   ← AI 入口总纲
└── knowledge/              ← 跨平台反模式知识库（单一来源）
    ├── antipatterns/     ← 按症状分类（症状 → 根因 → 正确方案）
    ├── common/           ← 通用格式速查（数据包/资源包/术语）
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
│   └── datapack-format.md         # 数据包格式速查
└── version-changes/                # 版本变更记录
    └── 1.13.x.md
```
