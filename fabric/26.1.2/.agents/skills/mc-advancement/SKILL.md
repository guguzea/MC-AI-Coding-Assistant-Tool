---
name: mc-advancement
description: Fabric 26.1.2 进度 DataGen。FabricAdvancementProvider.generateAdvancement。触发词：advancement、进度
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 进度（Fabric 26.1.2）

`26.1.2/develop_data-generation_setup` 的 Next Steps 链到 Advancements 页，但本机索引 **没有** `develop_data-generation_advancements` 全文。方法名来自 loader-api `FabricAdvancementProvider`。

```java
public class ModAdvancements extends FabricAdvancementProvider {
    @Override
    public void generateAdvancement(HolderLookup.Provider registryLookup, Consumer<AdvancementHolder> consumer) {
        // 往 consumer 接受 AdvancementHolder；条件用 withConditions
    }
}
```

已核：`generateAdvancement(HolderLookup.Provider, Consumer<AdvancementHolder>)`；`withConditions`；`createPlaceholder(Identifier)`。JSON 手写路径仍是数据包 `data/<modid>/advancement/`。

## Decision Flow

```
IF DataGen 进度
  → FabricAdvancementProvider.generateAdvancement
IF 只改 JSON
  → 数据包
IF 要逐步教程全文
  → search_fabric_docs version=26.1.2；DOC_NOT_FOUND 就停
```

## 常见错误

- ❌ Yarn `Consumer<Advancement>`（本档是 `AdvancementHolder`）
- ❌ 编造已删除的 advancements 文档 id
