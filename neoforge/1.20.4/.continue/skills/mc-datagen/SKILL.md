---
name: mc-datagen
description: NeoForge 1.20.4 mc-datagen。类名只来自本档核实表与 search_neoforge_docs。
platform: neoforge
version: "1.20.4"
dependencies: []
mappings: mojmap
docsTool: search_neoforge_docs
---

# mc-datagen（NeoForge 1.20.4）

Java 17。核实表：knowledge/common/verified-api-1.20.4.md。

事件：GatherDataEvent。RecipeProvider 等构造以该版 resources 页为准。

必须 search_neoforge_docs query=datagen version=1.20.4（或 resources）。无 generate_datagen 模板时不要理解为游戏里做不了，手动编写。文档：https://docs.neoforged.net/docs/1.20.4/resources/

不要用 1.12 LanguageRegistry。语言走 LanguageProvider。禁止 RegistryObject / SimpleChannel。
