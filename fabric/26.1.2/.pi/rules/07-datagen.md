---
description: 07 — DataGen
---

# 07 — DataGen

`26.1.2/develop_data-generation_setup`：模板勾选 Enable Data Generation；或 build.gradle + client 入口 + fabric.mod.json entrypoint。
配方/战利品/标签：`26.1.2/develop_data-generation_recipes` `26.1.2/develop_data-generation_loot-tables` `26.1.2/develop_data-generation_tags`。
run 配置 / `runDatagen` 以该页为准。

## Decision Flow

```
→ 入口类 → DataGeneratorEntrypoint（fabric-datagen）
→ 禁止 DataGeneratorInitializer / init_data
→ 配方/战利品/标签 → 对应 develop_data-generation_* 页
```
