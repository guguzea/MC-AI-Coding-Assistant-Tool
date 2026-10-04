# NeoForge 26.1 scaffold

完整对照官方 MDK 入口（与 1.20.4–1.21.11 八档同形）。完整工程请 `download_official_mdk`（精确 26.1.2 并选 buildPlugin —— 26.1.1/26.1.2 均同时提供 ModDevGradle 与 NeoGradle）。不要用根目录旧 scaffold 的 init(IEventBus) / NeoForgeAddonPlugin 口径。

> **26.1 与 1.21.x 档的三处差异**（照抄前必读）：
> 1. **去混淆**：26.1+ 官方 jar 已是 Mojang 名 ⇒ `build.gradle` **无 parchment 段**、`gradle.properties` 无 `parchment_*` 键；依赖用 `implementation` 而非 `modImplementation`。
> 2. **Java 25**：`java.toolchain.languageVersion = JavaLanguageVersion.of(25)`（26.1+ 字节码是 major 69，JDK 17/21 的 javac 读不了）。
> 3. **`@Mod` 构造器收 `(IEventBus, ModContainer)`**：本档 `ExampleMod.java` 用双参形（与 1.21.x 的 `(IEventBus)` 单参不同）。
>
> 版本锚点（Gradle 9.2.1 / MDG 2.0.144 / `neo_version=26.1.2.114`）是 2026-10-03 的实测读数，仅为参考 —— 以 `download_official_mdk` 实际产物为准，见 `build.gradle` 头注。
>
> `pack.meta.json` 的 `scaffold.mode = "gradle"`、`buildVerified = false`：文件结构已与同系八档对齐，但**本仓未真跑构建**（26.1 构建需 JDK 25 + Gradle ≥9.1，属人在环，agent 不代跑）。
