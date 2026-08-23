---
id: authored/legacy-forge-1.7.10-1.12.2-practices
title: 老版本 Forge（1.7.10 / 1.12.2）实务差异
tags: [legacy, forge, 1.7.10, 1.12.2, RegistryEvent, GameRegistry, MCP, SRG, tutorial]
summary: 与现代版的关键差异：GameRegistry/RegistryEvent 注册、无 DeferredRegister 时代写法；MCP/SRG 映射环境；资源目录 assets 结构不变但模型系统 1.8/1.13 分水岭；教程资源推荐与「别拿新文档补老工程」警告。
mcHint: 1.7.10 / 1.12.2
sourceKind: authored
---

# 老版本 Forge（1.7.10 / 1.12.2）实务差异

自写短文。为维护老 mod / 复刻老工程时避免「拿新版知识硬套」。本仓库 `forge/1.7.10`、`forge/1.12.2` 已有本档规则树与核实表，**API 名以那两档为准**，本篇只讲差异地图与学习方法。

## 版本分水岭速查

| 变化点 | 分水岭 | 影响 |
|--------|--------|------|
| 模型/贴图 JSON 化（item/blockstate） | **1.8** | 1.7.x 代码 setTextureName 的老写法到 1.8+ 全废 |
| 注册体系 | **1.12** | `@EventBusSubscriber` + `RegistryEvent.Register<?>` 取代 `GameRegistry.register` 散装注册 |
| 数据包/配方 JSON | **1.13** | 1.12 配方还是代码 + `CraftingHelper` JSON 混合 |
| 映射 | — | 1.7–1.12 运行时是 **SRG 名**，开发环境 MCP 名；崩溃日志见 SRG 属正常（本仓库 `lookup_obfuscated` 支持反查） |

## 1.7.10 典型形态

```java
@Mod(modid = "examplemod", name = "Example", version = "1.0")
public class ExampleMod {
    @EventHandler public void preInit(FMLPreInitializationEvent e) {
        GameRegistry.registerItem(myItem, "my_item");     // 散装注册
    }
}
```

- 生命周期 `preInit/init/postInit`；事件用 `@EventHandler`（不是 1.12+ 的 `@SubscribeEvent` 全场景）。
- 客户端专用：`ClientProxy` + `@SidedProxy` 模式；渲染注册在 preInit 走 proxy。
- 世界生成：`GameRegistry.registerWorldGenerator(IGenerator, weight)`——不是 modern PlacedFeature。

## 1.12.2 典型形态

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModItems {
    @SubscribeEvent
    public static void registerItems(RegistryEvent.Register<Item> event) {
        event.getRegistry().register(new ItemBase("my_item"));
    }
}
```

- `DeferredRegister` 是 **1.19+/NeoForge 才成熟**的写法；1.12.2 别抄。
- ModelLoader：`ModelLoader.setCustomModelResourceLocation(...)` 在 `ModelRegistryEvent`；itemstack damage 变体走 `getModelLocation`。
- 配方：`CraftingHelper.register` + JSON 或 ShapedOreRecipe；矿物词典是 `OreDictionary`（1.12 独有概念，1.13+ 被 tags 替代）。
- GUI：`GuiHandler` + `IModGuiFactory` 配置界面时代；NetworkChannel 用 `SimpleNetworkWrapper`。

## 学习路径与资源

- 本仓库 MCP 工具：Forge 1.12.2 文档检索**必须用 `search_forge_docs`（version=1.12.2）**；`query_api` 对 1.12.2 是空壳（found:true 但 methods 空），禁止用它核签名。
- 社区教程（未逐页入库，引用前打开核对）：Kaupenjoe 早期系列（Forge-Tutorial-1.17.1 及更早在其 GitHub 有存档）、mcmod.cn 3993 号教程主体即 1.18 前后（已许可提炼于 permitted/）。
- 1.7.10 中文资料多在 MC百科 post 区与老博客；年代久远，链接易失效——以仓库 safe-api 表为准，教程只当导览。

## 「老工程移植」检查单

1. 先判加载器与精确版本（根 AGENTS.md 第一步），确认有没有 LiteLoader 混合。
2. 崩溃日志里的 SRG 名（`func_XXXXX_a`）→ 用 `lookup_obfuscated` 反查再定位。
3. 不要把 1.20 的能力（Capability/DataComponent）当成 1.12 已有：1.12 只有 Capability 雏形且用法不同。
4. 移植目标版本选型（留 1.12.2 还是升 1.20.1/1.21）是人在环决策：工作量差一个数量级，先给清单让用户拍板。

## 自检

- 开发环境 `runClient` 过了映射重映射这一关（ForgeGradle 版本要配老版兼容）。
- 资源路径仍是 `assets/<modid>/…` 但 1.8+ 需要 blockstate/models JSON 齐全。
- 专用服启动验证 proxy/sided 划分没漏。

## 不清楚时

- 本仓库规则树：`forge/1.7.10/`、`forge/1.12.2/`（含 safe-api 核实表）
- 文档工具：`search_forge_docs`（version=1.7.10 / 1.12.2）
- 社区实务：`search_community_docs`（关键词 1.12.2 / legacy）；发布/崩溃类短文通用章节适用
