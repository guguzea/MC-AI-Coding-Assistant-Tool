# Architectury 跨平台要点

## 何时用

同一套逻辑要同时发 Forge/Fabric（及 NeoForge）时。先做平台分析再脚手架。

## Decision Flow

1. `analyze_porting_path` 看当前工程是否适合抽 `common`。
2. 使用 Architectury 模板或 `port_project` 的 `init_architectury`（默认 dryRun）。
3. 平台相关 API 放到 `forge`/`fabric` 源集；`common` 只放共享。
4. 映射：Yarn（Fabric）与 MCP/Mojang（Forge）勿在 common 混写同一符号期望。

## MCP

- `analyze_porting_path`、`port_project`
- `convert_mapping`、`get_migration_guide`

## 官方入口

- https://github.com/architectury/architectury-templates  
- https://docs.architectury.dev/

## 常见坑

- common 里直接 `import net.minecraftforge.*`
- 未配置 architectury transformer 导致运行时缺类

## 不清楚时

打开 Architectury 文档当前版本 + 官方模板 diff。
