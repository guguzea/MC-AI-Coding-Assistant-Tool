---
name: mc-datagen
description: NeoForge 26.1 mc-datagen。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "26.1"
dependencies: []
mappings: mojmap
docsTool: search_neoforge_docs
---

# mc-datagen（NeoForge 26.1）

Java 25。核实表：knowledge/common/verified-api-26.1.md。

事件：GatherDataEvent.Client / GatherDataEvent.Server。RecipeProvider 等构造以该版 resources 页为准。

必须 search_neoforge_docs query=datagen version=26.1（或 resources）。无 generate_datagen 模板时不要理解为游戏里做不了，手动编写。文档：https://docs.neoforged.net/docs/resources/

不要用 1.12 LanguageRegistry。语言走 LanguageProvider。禁止 RegistryObject / SimpleChannel。
