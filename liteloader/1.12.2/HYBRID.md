# LiteLoader + Forge 混合（1.12.2）

- **注册走 Forge**（`RegistryEvent`，读 `forge/1.12.2` 的 01–03）
- **Tick/聊天/渲染走 LiteLoader**（本目录 05 / 08）
- **唯一 Gradle 入口**：

```groovy
apply plugin: 'net.minecraftforge.gradle.liteloader'
```

> **辨析（易混）**：`net.minecraftforge.gradle.liteloader` 是 **LiteLoader 混合工程专用**的
> ForgeGradle 插件 id（LiteLoaderForgeGradle），本档用它是对的。
> **`tweaker-client` 是 Rift 的**（`rift/1.13.2/scaffold/build.gradle`），与 LiteLoader 无关；
> 不要因为看到「tweaker 客户端」这类表述就把 Rift 的写法搬到这里，也不要把本 id 用到 Rift 工程上。

禁止：`apply plugin: 'net.minecraftforge.gradle.forge'` 再另 apply 一个 LiteLoader 插件。

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
