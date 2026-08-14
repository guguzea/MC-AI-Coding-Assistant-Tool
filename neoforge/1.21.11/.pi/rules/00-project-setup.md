---
description: 00 — 项目结构（NeoForge 1.21.11）
---

# 00 — 项目结构（NeoForge 1.21.11）

来源：https://docs.neoforged.net/docs/1.21.11/gettingstarted/ 与官方 MDK（download_official_mdk 精确 1.21.11）。不要用 ForgeGradle / Yarn 冒充。

## 构建插件

官方模组生成器对多个 MC 版本**同时**提供 ModDevGradle（`net.neoforged.moddev`）与 NeoGradle（`net.neoforged.gradle.userdev`）。**禁止按版本硬绑**。从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`。

## Java / mappings

- Java **21**
- mojmap（游戏仍混淆；与 26.1 去混淆不是同一档）
- 1.21.11 文档已用 Identifier.fromNamespaceAndPath，不要再写 ResourceLocation.fromNamespaceAndPath。

## 入口

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
    IEventBus + 可选 ModContainer（以 MDK 为准） {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
```

本档仍是混淆游戏 + mojmap 开发名。去混淆是 26.1，禁止把 26.1 规则并进本档。

元数据：neoforge.mods.toml。modId 全小写、无 `-`。

## 禁止

- `NeoForgeAddonPlugin`、`getBootstrapContext().getEventBus`
- 用 Forge `mods.toml` + `net.minecraftforge` 包当 NeoForge 1.21.11
- 把邻版 MDK zip 当本版
- 官方 MDK 404 时回退邻版
