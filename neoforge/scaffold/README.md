# 已废弃的扁平 scaffold

请用 `neoforge/<ver>/scaffold/` 或 `download_official_mdk`。

本目录 `ExampleMod.java` 已改成 **1.20.4 官方 MDK 口径**（`@Mod` + `ExampleMod(IEventBus)` + `DeferredRegister.createBlocks`），避免旧错文件（`init(IEventBus)`、`Item.Properties.tab()`）继续误导。
