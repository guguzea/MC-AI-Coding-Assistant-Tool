# Patchouli 手册集成要点

## 何时用

需要游戏内指南书 / 分类条目。以 Patchouli 数据包格式为主，少写死 Java UI。

## Decision Flow

1. 添加 Patchouli 依赖（版本对齐 MC）。
2. 在 `assets/<modid>/patchouli_books/<book_id>/` 放 `book.json` 与语言目录。
3. 条目用 JSON（类别、页面类型）；需要自定义页面类型再写 Java。
4. 解锁条件、进度与 Advancement 可联动（可选）。

## MCP

- `validate_datapack_json`、`audit_resources`
- Skill：`mc-patchouli`、`mc-datapack`

## 官方入口

- https://github.com/VazkiiMods/Patchouli  
- https://vazkiimods.github.io/Patchouli/

## 常见坑

- book id / 语言文件夹名不一致
- 把手册资源放进 `data/` 而不是 `assets/`（或相反，以文档为准）

## 不清楚时

打开 Patchouli 文档「Getting Started」与示例书。
