---
name: mc-registry
description: ModLoader 1.6.4 BaseMod / ModLoader.registerBlock。表外停。
platform: modloader
version: "1.6.4"
docsTool: search_docs
---

# mc-registry（ModLoader 1.6.4）

核实表：knowledge/common/safe-api.md。
必须 search_docs({platform:"modloader"}) version=1.6.4。

表内：mod_<Name> extends BaseMod；getVersion()；load()；ModLoader.registerBlock(Block)；ModLoader.registerTileEntity(Class, String)。
禁止 DeferredRegister / RegistryEvent / net.fabricmc。不在核实表内，禁止输出。
