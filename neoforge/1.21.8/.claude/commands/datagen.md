---
name: mc-datagen
description: NeoForge 1.21.8 mc-datagen。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.21.8"
dependencies: []
mappings: mojmap
docsTool: search_neoforge_docs
---

# mc-datagen（NeoForge 1.21.8）

Java 21。核实表：knowledge/common/verified-api-1.21.8.md。

事件：GatherDataEvent.Client / GatherDataEvent.Server（已拆分）；先 createDatapackRegistryObjects 再用 createProvider。RecipeProvider 等构造以该版 resources 页为准。

必须 search_neoforge_docs query=datagen version=1.21.8（或 resources）。无 generate_datagen 模板时不要理解为游戏里做不了，手动编写。文档：https://docs.neoforged.net/docs/1.21.8/resources/

不要用 1.12 LanguageRegistry。语言走 LanguageProvider。禁止 RegistryObject / SimpleChannel。
