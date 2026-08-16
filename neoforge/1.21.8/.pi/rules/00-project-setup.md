---
description: 00 — 项目结构（NeoForge 1.21.8）
---

# 00 — 项目结构（NeoForge 1.21.8）

来源：https://docs.neoforged.net/docs/1.21.8/gettingstarted/ 与官方 MDK（download_official_mdk 精确 1.21.8）。不要用 ForgeGradle / Yarn 冒充。

## 构建插件

官方模组生成器对多个 MC 版本**同时**提供 ModDevGradle（`net.neoforged.moddev`）与 NeoGradle（`net.neoforged.gradle.userdev`）。**禁止按版本硬绑**。从零工程调用 `download_official_mdk` 时必须传 `buildPlugin`。

## Java / mappings

- Java **21**
- mojmap
- 1.21.8 文档 resources 页已用 GatherDataEvent.Client；网络配置任务仍见 ResourceLocation.fromNamespaceAndPath。

## 入口

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";
    public static final DeferredRegister.Blocks BLOCKS = DeferredRegister.createBlocks(MODID);
    public static final DeferredRegister.Items ITEMS = DeferredRegister.createItems(MODID);
    public ExampleMod(IEventBus modEventBus, ModContainer modContainer) — 以该版 MDK 为准 {
        BLOCKS.register(modEventBus);
        ITEMS.register(modEventBus);
    }
}
```

DataGen 必须用 Client/Server 子事件，不要写回单一 GatherDataEvent。

元数据：neoforge.mods.toml。modId 全小写、无 `-`。

## 禁止

- `NeoForgeAddonPlugin`、`getBootstrapContext().getEventBus`
- 用 Forge `mods.toml` + `net.minecraftforge` 包当 NeoForge 1.21.8
- 把邻版 MDK zip 当本版
- 官方 MDK 404 / 无 pin 时返回 MDK_NOT_PINNED，禁止邻版 MDK
