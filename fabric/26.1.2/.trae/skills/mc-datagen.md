---
name: mc-datagen
description: Fabric 26.1.2 mc-datagen。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# DataGen（Fabric 26.1.2）

文档：`26.1.2/develop_data-generation_setup`。

- 入口：`DataGeneratorEntrypoint` + fabric.mod.json `fabric-datagen`
- **禁止** `DataGeneratorInitializer` / `init_data`（那是错 API）
- 配方/战利品/标签页：`develop_data-generation_recipes` 等
