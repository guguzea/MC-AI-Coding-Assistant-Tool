# convert_mapping 字段映射（schema v3）

## 何时用

需要在 **mojang / mcp / yarn / parchment** 之间互转**字段名**时（如 `field_110151_bq` ↔ `absorptionAmount`）。

## 用法

- 传 `memberKind: "field"`（或名称以 `field_` / `f_` 开头）。
- 1.16+ Yarn：尽量带 `ownerClass`。
- 1.14–1.15：全局 `fields.csv` 的 searge↔named（勿传 owner）。
- 若返回 `SCHEMA_FIELDS_UNAVAILABLE`：运行 `npm run build:yarn-sqlite` 重建为 schema **v3**。

## 相关

- 类/方法仍用默认 `convert_mapping`；参数名用 `get_method_params`。
- 注册表资源 ID（`minecraft:stone`）用 `query_registry`，不是字段映射。

## 原文 / 数据

仓库内 `yarn-mappings.sqlite` + MCP `fields.csv` / Tiny FIELD 行；非外部网页全文。
