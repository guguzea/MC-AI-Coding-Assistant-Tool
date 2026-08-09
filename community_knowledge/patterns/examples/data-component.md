# Data Component（1.20.5+ / 1.21）

- **平台**：NeoForge / Vanilla 1.21.x
- **Skill**：`mc-item`
- **MCP**：`get_migration_guide`、`search_neoforge_docs`、`query_api`

```java
// 概念：用 DataComponentType 替代大量自定义 NBT 键
// 具体注册 API 以当前版本官方文档为准（变化快）
public static final DeferredRegister.DataComponents COMPONENTS =
    DeferredRegister.createDataComponents(Registries.DATA_COMPONENT_TYPE, MODID);
```

## 坑

- 不要把 1.20.1 NBT 教程原样搬到 1.21
- 编解码与网络同步组件需成对出现
- 不清楚时：`get_doc_full` NeoForge Data Components 专章
