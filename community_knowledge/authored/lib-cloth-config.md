# Cloth Config 集成要点

## 何时用

Fabric（及部分跨平台）需要友好配置屏时。Forge 原生可用 `ForgeConfigSpec`（见 patterns `config-spec`）。

## Decision Flow

1. 确认 Loader：Fabric Loom + Cloth Config 坐标。
2. 用 Cloth 的 ConfigBuilder / ConfigEntryBuilder 建屏。
3. Mod Menu 入口（若需要）单独软依赖。
4. 配置读写路径遵循 Cloth 文档（不要手写冲突路径）。

## MCP

- `generate_config`（`loader=fabric`）
- Skill：`mc-config`

## 官方入口

- https://github.com/shedaniel/cloth-config

## 常见坑

- 仅在客户端注册 Screen，却在公共代码引用 Screen 类
- 与 ForgeConfigSpec 混用同一套期望路径

## 不清楚时

打开 Cloth Config README 与示例 mod。
