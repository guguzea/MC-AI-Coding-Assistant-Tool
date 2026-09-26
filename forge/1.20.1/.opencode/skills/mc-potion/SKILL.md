---
name: mc-potion
description: 药水与酿造。触发词：Potion、BrewingRecipe
platform: forge
version: "1.20.1"
dependencies: []
mappings: parchment
---

# mc-potion

> 本档正文的方法名 / 事件名 / 注册表名只来自 `data/forge_1.20.1` 本档语料。实读页面（均在 `forge-docs/1.20.1/processed/`）：
> `resources_server_recipes_incode.md`（§Brewing Recipes / §IBrewingRecipe）、`resources_server_tags.md`（§Tags 里的 `Potion` 面）、`concepts_registries.md`（`registryName = "potion"` 的 `@ObjectHolder` 示例）、`concepts_events.md`（`PotionBrewEvent` 作为多阶段事件的举例）。
> 页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.19.4 / 1.20.4 / NeoForge）或 Fabric 档补全。
>
> ⚠️ mappings：本档 frontmatter 记 `mappings: mcp`，但这四页正文与代码示例一律用官方名（`PotionBrewing`、`ItemStack`、`CompoundTag`、`ResourceLocation`）。本档 scaffold 默认通道是 **parchment**（= mojmap 名 + 社区参数名）。**禁止**在本主题里写 `func_XXXXX` / `field_XXXXX`，也禁止写 Yarn 名或 `class_` / `method_` 中间名；按用户工程实际声明的通道取名。
> ⚠️ 本档语料里 `MobEffect` 只在本地化页出现一次，**药水效果（`MobEffect`）本身另见 `mc-effect`，两页互不背书。**

## 酿造配方是「代码里的配方」，不是数据包配方

`resources_server_recipes_incode.md` 开宗明义：并非所有配方都已数据驱动，部分子系统仍要在代码里打补丁；**Brewing 就是少数仍存在于代码中的配方之一**。

页内给出的事实面（逐字口径）：

- 原版酿造配方是在 `PotionBrewing` 的 bootstrap 中加入的，分三类：containers、container recipes、potion mixes。
- Forge 的扩展入口：在 `FMLCommonSetupEvent` 里调用 `BrewingRecipeRegistry#addRecipe` 添加酿造配方。
- ⚠️ 页面带 **Warning**：`BrewingRecipeRegistry#addRecipe` **不是线程安全**的，必须放进同步工作队列，即通过 `#enqueueWork` 调用。
- 默认实现接收三样东西：input ingredient（输入材料）、catalyst ingredient（催化剂）、stack output（输出 `ItemStack`）。
- 也可以改为传入一个 `IBrewingRecipe` 实例来做转换。

`BrewingRecipeRegistry#addRecipe` 的**确切重载与参数顺序、其所在包名，本档页面未给出代码块** ⇒ `// TODO(未核实)`：写工程代码前用 `get_forge_doc_full(version="1.20.1", id="resources_server_recipes_incode")` 复核，或对用户自备的 Forge jar 跑 `query_loader_api`（`platform=forge`, `minecraftVersion=1.20.1`）逐签名核对。禁止凭记忆补参数表。

页面结构（含 `enqueueWork`）的可用骨架只到这一层：

```java
// FMLCommonSetupEvent 处理器内
event.enqueueWork(() -> {
    // TODO(未核实): PotionBrewing.addRecipe(...) 的具体参数形态本档页面未给代码
});
```

## IBrewingRecipe

页面对该接口的全部描述（可直接引用的口径）：

- `IBrewingRecipe` 是一个「pseudo-`Recipe`」接口（页面把它反向指到 `../custom/#recipe`），负责判断 input 与 catalyst 是否合法，并在合法时给出对应 output。
- 三个方法各自对应上述职责：`#isInput`、`#isIngredient`、`#getOutput`；其中输出方法可以同时拿到 input 与 catalyst 两个 stack 来构造结果。
- 页面带 **Important**：在 `ItemStack` 或 `CompoundTag` 之间搬运数据时，务必用它们各自的 `#copy` 方法生成独立实例。
- **没有**类似原版的包装器可用来追加 potion containers 或 potion mixes；要复刻该行为必须自行新增一个 `IBrewingRecipe` 实现。

页面未给出 `IBrewingRecipe` 的方法返回值类型与 `Ingredient` / `ItemStack` 的具体签名 ⇒ `// TODO(未核实)`，禁止默写 `implements IBrewingRecipe { ... }` 的完整类体。

## Potion 作为注册表内容

`concepts_registries.md` 里与 potion 直接相关的一行（原文照抄）：

```java
@ObjectHolder(registryName = "potion")
public static final Potion levitation = null;     // Annotation present. [public static] is required. [final] is optional.
                                                  // Registry name is explicitly defined: "minecraft:potion"
```

- 由此可确认本档的注册表名是 `potion`（解析后 `minecraft:potion`）。
- 自定义 `Potion` 怎么注册（`DeferredRegister` 建在哪个 registry 上）本档页面**没有**示例 ⇒ `TODO(未核实)`：改读 `01-registry.mdc` 并核 `ForgeRegistries.POTIONS` 是否即本档入口（下节 tag 代码里 `ForgeRegistries.POTIONS` 在本档逐字出现过，注册入口本身未出现）。

## Potion 的 tag

`resources_server_tags.md` 逐字给出的写法（示例代码块内）：

```java
public static final TagKey<Potion> myPotionTag = ForgeRegistries.POTIONS.tags().createTagKey(new ResourceLocation("mymod", "mypotiongroup"));

// In some method:
Potion potion = /*...*/;
boolean isInPotionGroup = ForgeRegistries.POTIONS.tags().getTag(myPotionTag).contains(potion);
```

同页对目录命名的规则（原文口径）：tag 声明在 mod 自己的 datapack 里；`Block`、`Item`、`EntityType`、`Fluid`、`GameEvent` 用复数形式的文件夹，**其余注册表用单数**——页面明确点例：`EntityType` 用 `entity_types`，而 `Potion` 用 `potion`。Block 侧的路径样例是 `/data/<modid>/tags/blocks/foo/tagname.json`（把 `blocks` 换成 `potion` 即单数形态）。

覆盖 / 合并规则同页：在他方域名下声明同名 JSON 即可 append 或 override；例如往原版 sapling tag 加东西写在 `/data/minecraft/tags/blocks/saplings.json`，`replace` 为 false 时原版在 reload 时合并；`replace` 为 true 时，声明该行的 JSON 之前的所有条目会被移除；列出的值不存在会让 tag 报错，除非写成 `id` 字符串 + `required: false`。

## 酿造事件

`concepts_events.md` 里 `PotionBrewEvent` 只作为「一个事件有多个阶段」的**举例**出现（同例还有 `PlayerEvent`），并提醒：监听父事件类会收到**所有**子类的调用。该页未展开 `PotionBrewEvent` 的阶段划分、可取消性与字段 ⇒ 需要监听酿造过程时先 `get_forge_doc_full(version="1.20.1", id="concepts_events")` 现读现抄，禁止按 NeoForge 记忆写 `@SubscribeEvent(priority = ...)` 的具体形态。

## 本档未覆盖（禁止默写）

- **`MobEffect` / `EffectInstance` 的注册与施加**：本档语料里 `MobEffect` 只在 `datagen_client_localization.md` 的一句 `LanguageProvider` 方法枚举中出现一次，无任何效果开发正文 ⇒ 见 `mc-effect`（该主题本档同样无正文，须联网补）。
- **自定义 `Potion` 的注册代码、`Potion#registerEffects` / 效果列表**：本档无示例 ⇒ 不写。
- **`BrewingRecipeRegistry` / `IBrewingRecipe` 的包名与完整签名**：页面只有名字，没有 import 与代码块 ⇒ 不写。
- **酿造台 GUI / `BrewingStandBlockEntity`、火焰与燃料槽逻辑**：本档 processed 无相关页 ⇒ 不写。
- **药水物品 JSON 组件（1.20.5+ 的 data component 化改造）**：不属于本档版本面 ⇒ 禁止从邻档 / NeoForge 借。
- **`minecraft:no_item_required` 之类的 banner pattern tag 内容**：同页的 Loom / Anvil 小节属别的主题（`AnvilUpdateEvent`、`BannerPattern`），需要时另读该页。

## 相关

- 注册：`01-registry.mdc` / `mc-registry`；事件与 `enqueueWork`：`05-events.mdc` / `mc-events`
- 配方（数据包侧）：`mc-recipe`，本档 `resources_server_recipes.md` / `resources_server_recipes_custom.md` 在盘
- Tag 与 datapack 布局：`resources_server_tags.md`（本档 processed，已在盘）
- 反模式：`forge/1.20.1/knowledge/antipatterns/`
- 全文核对：`get_forge_doc_full(version="1.20.1", id="resources_server_recipes_incode")` / `id="resources_server_tags"`
