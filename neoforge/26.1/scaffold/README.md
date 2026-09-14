# NeoForge 26.1 scaffold

最小对照官方 MDK 入口。完整工程请 `download_official_mdk`（精确 26.1.2 并选 buildPlugin）。不要用根目录旧 scaffold 的 init(IEventBus) / NeoForgeAddonPlugin 口径。

> **本档 scaffold 是 `reference` 模式，不是可直接构建的完整工程**（`pack.meta.json` 的 `scaffold.mode = "reference"`、`buildVerified = false`）。
> 盘上只有 3 件：`README.md`、`build.gradle`、`src/main/java/com/example/examplemod/ExampleMod.java`。
> 缺件（`gradle.properties`、`settings.gradle` + wrapper 三件套、`.gitignore`/`.gitattributes`/`TEMPLATE_LICENSE.txt`、`src/main/templates/META-INF/neoforge.mods.toml`、`assets/examplemod/lang/en_us.json` 等）**逐条列在 `../pack.meta.json` 的 `scaffold.gaps[]`，未补齐是刻意取舍**：
> reference 模式不代生成元数据，模组元数据须由用户工程自备或取 `download_official_mdk` 的实际产物。
> 抄本档代码前请以 gaps 为准，不要假设同系 1.20.4–1.21.11 八档的完整骨架件在这里存在。

