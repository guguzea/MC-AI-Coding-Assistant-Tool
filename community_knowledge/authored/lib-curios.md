# Curios / Trinkets 风格饰品槽

## 何时用

需要饰品栏、额外装备槽。Forge 侧常见 **Curios API**；Fabric 常见 Trinkets（API 不同，勿混用）。

## Decision Flow

1. 选定平台：Forge → Curios；Fabric → Trinkets。
2. 声明软/硬依赖：`mods.toml` / `fabric.mod.json`。
3. 注册 slot type（数据包或 API，以当前文档为准）。
4. 物品实现 Curios 能力 / 组件接口；GUI 仅客户端。

## MCP

- `check_dependencies`、`search_community_docs`
- Skill：`mc-curios`、`mc-item`、`mc-capability`

## 官方入口

- Curios：https://github.com/TheIllusiveC4/Curios  
- 以对应 MC 版本的 wiki / examples 为准。

## 常见坑

- 把 Curios 代码拷到 Fabric
- 未标记 `optional` 导致未装 Curios 无法进档（若本意是软依赖）
- Capability 未在正确生命周期 invalidate

## 不清楚时

打开 Curios 当前版本示例工程 + 官方 wiki。
