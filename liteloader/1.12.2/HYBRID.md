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
