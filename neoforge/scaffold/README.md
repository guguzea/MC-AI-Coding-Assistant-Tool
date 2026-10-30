# 已废弃的扁平 scaffold

请用 `neoforge/<ver>/scaffold/` 或 `download_official_mdk`。

⚠️ 本目录元数据文件名是 `neoforge.mods.toml`（1.20.6+ 命名），而 `gradle.properties` 写 1.20.4 ⇒ 照它建工程需改名为 `META-INF/mods.toml`（已登记，未改文件）。
本目录 `ExampleMod.java` 已改成 **1.20.4 官方 MDK 口径**（`@Mod` + `ExampleMod(IEventBus)` + `DeferredRegister.createBlocks`），避免旧错文件（`init(IEventBus)`、`Item.Properties.tab()`）继续误导。
