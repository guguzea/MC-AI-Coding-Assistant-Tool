# LiteLoader + Forge 混合（1.12.2）

- **注册走 Forge**（`RegistryEvent`，读 `forge/1.12.2` 的 01–03）
- **Tick/聊天/渲染走 LiteLoader**（本目录 05 / 08）
- **Gradle 入口（2026-10-04 实测更正，原写法已证伪）**：

```groovy
buildscript {
    repositories { maven { url = 'https://maven.minecraftforge.net/' }; mavenCentral() }
    dependencies { classpath 'net.minecraftforge.gradle:ForgeGradle:2.3-SNAPSHOT' }
}
apply plugin: 'net.minecraftforge.gradle.forge'      // ← 不是 net.minecraftforge.gradle.liteloader
minecraft { version = '1.12.2-14.23.5.2847'; mappings = 'stable_39'; runDir = 'run' }
dependencies {
    deobfCompile 'com.mumfrey:liteloader:1.12.2-SNAPSHOT'                     // 发布件是 SRG 名，必须过 deobf
    compile('org.spongepowered:mixin:0.7.4-SNAPSHOT') { transitive = false }  // 必须关传递依赖，见坑 78
    compile('org.ow2.asm:asm-all:5.2')              { transitive = false }
}
repositories {
    maven { url = 'http://repo.mumfrey.com/content/repositories/snapshots/' }
    maven { url = 'https://repo.spongepowered.org/maven/' }
}
afterEvaluate { tasks.runClient { args '--tweakClass', 'com.mumfrey.liteloader.launch.LiteLoaderTweaker' } }
```

完整可编译版见 `scaffold/hybrid/build.gradle`（**该文件即按上面这套配方实测建出 `E:\MC_GAME\liteloader-1.12.2` 并跑绿村庄整轮 16/16**）。

> **⚠️ 已被推翻的说法（留档，勿照抄）**：本节原先写「唯一 Gradle 入口 = `apply plugin: 'net.minecraftforge.gradle.liteloader'`」并**禁止**改用 `forge` 插件 —— **错**。`LiteloaderPlugin extends UserVanillaBasePlugin`（javap 核过）⇒ 它给的是 **vanilla + LiteLoader、不带 Forge**，用它编译本目录的产物会报 `找不到符号: 程序包 net.minecraftforge.fml.common 不存在` 等 8 处；且 `minecraft.version` 必须逐字写 `'1.12.2'`（否则 `No ForgeGradle-compatible LiteLoader version found`）。证据与实测配方见社区短文坑 77 / 78。
>
> **`tweaker-client` 是 Rift 的**（`rift/1.13.2/scaffold/build.gradle`），与 LiteLoader 无关；不要因为看到「tweak 客户端」就把 Rift 的写法搬到这里，也不要把 `net.minecraftforge.gradle.tweaker-client` 用到本档。

- **MCP 映射必须钉死**，例如：

```groovy
minecraft {
    mappings = 'stable_39'
}
```

缺映射 → 运行时 `NoSuchMethodError` / `AbstractMethodError`。

聊天命令（E2E-001）：同时有 `@Mod`（Forge 侧）和 `LiteMod` + `OutboundChatListener`（客户端）。

## 元数据：混合工程到底要哪些文件

- **LiteLoader 侧**：`src/main/resources/litemod.json` —— 本档 hybrid scaffold 的 resources 下实测**只有**这一个文件（`scaffold/hybrid/src/main/resources/litemod.json`，键 = `name` / `version` / `mcversion` / `revision`），LiteLoader 靠它发现插件。
- **Forge 侧**：`@Mod` 注解自带三个属性即可（scaffold 实况 `src/main/java/com/example/examplehybrid/ForgeEntry.java:5` = `@Mod(modid = "examplehybrid", name = "Example Hybrid", version = "1.0.0")`）⇒ **不需要** `mcmod.info` 也能被 FML 发现。`mcmod.info` 按本档语料只服务于主菜单 Mods 按钮的用户向展示，且 `useMetadata` 默认 `false`（`data/forge_1.12.2/forge-docs/1.12.2/processed/gettingstarted_structuring.md:21`、`:85`），要写就写进 `src/main/resources/mcmod.info`。
- **禁止**为混合工程补 `mods.toml`：那是 1.13+ FML 的语法，1.12.2 不认（本仓 `liteloader/` 全树 `mods.toml` 实测 0 命中）。
- 上述两条只核实了**静态证据**（scaffold 源码 + 本档语料）；混合 jar 在真机 FML/LiteLoader 双发现的行为本轮**未核实**，要断言请先跑一次 `runClient`。
