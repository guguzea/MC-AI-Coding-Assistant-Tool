---
description: 00 — 项目结构（NeoForge 1.20.4）
---

# 00 — 项目结构（NeoForge 1.20.4）

来源：https://docs.neoforged.net/docs/1.20.4/gettingstarted/ 与官方 MDK（NeoForgeMDKs/MDK-1.20.4-NeoGradle @ 8cd443623d2fd12ef8a6912d2af1296d8522faac 与 MDK-1.20.4-ModDevGradle @ ddfff1d83adca54ac44fe70a6f3b85d3033f0e3a）。不要用 ForgeGradle / Yarn 冒充。

## 构建插件

官方模组生成器对多个 MC 版本**同时**提供 ModDevGradle（`net.neoforged.moddev`）与 NeoGradle（`net.neoforged.gradle.userdev`）。**禁止按版本硬绑**。从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`。

## Java / mappings

- Java **17**
- mojmap / NeoForm 官方名（不是 Forge MCP）
- 本档仍用 ResourceLocation 构造函数，不是 fromNamespaceAndPath，也不是 Identifier。

## 入口

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
    public ExampleMod(IEventBus modEventBus) {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
```

FML 注入 IEventBus。禁止 NeoForgeAddonPlugin / getBootstrapContext。

元数据：META-INF/mods.toml（官方 MDK 1.20.4 ExampleMod 注释仍写 mods.toml）。modId 全小写、无 `-`。

## 禁止

- `NeoForgeAddonPlugin`、`getBootstrapContext().getEventBus`
- 用 Forge `mods.toml` + `net.minecraftforge` 包当 NeoForge 1.20.4
- 把邻版 MDK zip 当本版
- 官方 MDK 404 / 无 pin 时返回 MDK_NOT_PINNED，禁止邻版 MDK
