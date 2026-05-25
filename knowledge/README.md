# Minecraft Modding 知识库

> AI 在生成代码前，应先阅读本知识库中相关文档以获取背景知识。

## 目录

```
knowledge/
├── README.md                     # 本文件
├── common/                      # 通用文档
│   ├── glossary.md              # 术语表
│   ├── datapack-format.md       # 数据包格式速查
│   └── resourcepack-format.md   # 资源包格式速查
├── antipatterns/               # 反模式库（按症状分类）
│   ├── registry.md             # 注册相关
│   ├── item.md                 # 物品/工具相关
│   ├── entity.md               # 实体相关
│   └── gradle.md              # Gradle 构建相关
└── version-changes/            # 版本变更记录
    ├── 1.20.x.md              # 1.20.x 变更
    └── 1.19.x.md              # 1.19.x 变更
```

## 使用方式

当 AI 需要生成以下内容时，自动读取对应文档：

| 生成内容 | 先读文档 |
|----------|----------|
| 数据包 JSON | `common/datapack-format.md` |
| 资源包 | `common/resourcepack-format.md` |
| 注册失败崩溃 | `antipatterns/registry.md` |
| 物品/工具 API | `antipatterns/item.md` |
| Gradle 构建错误 | `antipatterns/gradle.md` |
| 从旧版迁移 | `version-changes/1.19.x.md` |
