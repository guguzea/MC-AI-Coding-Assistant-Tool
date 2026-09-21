---
name: mc-loottable
description: 战利品表 JSON 与 LootTableProvider。触发词：loot_table、pools
platform: forge
version: "1.20.1"
dependencies: []
mappings: mcp
---

# mc-loottable

> 本档正文的类名/签名只来自 `data/forge_1.20.1` 本档语料，逐字读自这两页：
> `forge-docs/1.20.1/processed/resources_server_loottables.md`、
> `forge-docs/1.20.1/processed/datagen_server_loottables.md`。
> 页内没有的签名一律留 `TODO(未核实)`；**禁止**用 `data/forge_1.20.4` 或 Fabric / NeoForge 文档补全。
> datagen 页自己声明：战利品表功能过于庞大，**本文档不打算完整覆盖**，只给每个组件的简述，具体子类型「留给读者用 IDE 自行查看」。所以下文凡涉及具体子类型清单，一律按缺证据处理。

## 表的位置与取用

大多数原版战利品表数据驱动，靠 JSON：新增一张表不需要模组，只需要一个数据包。

一张表由其 `ResourceLocation` 引用，指向 `data/<namespace>/loot_tables/<path>.json`。

- 取表：`LootDataResolver#getLootTable`；`LootDataResolver` 经 `MinecraftServer#getLootData` 得到。
- 生成一定要带参数。`LootParams` 含：所在 level、luck（影响生成质量）、定义场景上下文的 `LootContextParam`、以及激活时应产生的动态信息。`LootParams` 用 `LootParams$Builder` 的构造器创建，经 `LootParams$Builder#create` 传入 `LootContextParamSet` 完成构建。
- 表还可以有上下文。`LootContext` 接收构建好的 `LootParams`，并可设置一个带种子的随机实例。上下文经 `LootContext$Builder` 构建，用 `LootContext$Builder#create` 传入一个**可为 null 的 `ResourceLocation`**（表示要用的随机实例）。

`LootTable` 生成 `ItemStack` 的方法（可接收 `LootParams` 或 `LootContext`）：

| 方法 | 说明 |
| --- | --- |
| `getRandomItemsRaw` | 消费战利品表生成的物品 |
| `getRandomItems` | 返回战利品表生成的物品 |
| `fill` | 用生成的战利品填满一个容器 |

> **Note（页内原文）**：战利品表是为生成物品而造的，因此这些方法**期望调用方对 `ItemStack` 做一些处理**。

## Forge 追加的行为

### `LootTableLoadEvent`

在 **Forge 事件总线**上触发，每当一张战利品表被加载时触发。**取消该事件会导致加载一张空表**。

> **Important（页内原文）**：**不要**通过该事件修改战利品表的掉落。这类修改应当用 global loot modifiers 完成。
> ⇒ 走 GLM：同档页 `resources_server_glm.md`、`datagen_server_glm.md`（对应 `mc-datapack` / `07-datagen.mdc`）。本页未给出 GLM 的 JSON 与 API 细节，禁止在此默写。

### Loot Pool Names

 loot pool 可以用 `name` 键命名。**未命名的 pool** 的名字是「该 pool 的 hash code 前缀 `custom#`」。

```json
// For some loot pool
{
  "name": "example_pool", // Pool will be named 'example_pool'
  "rolls": { /* ... */ },
  "entries": { /* ... */ }
}
```

### Looting Modifiers

战利品表现在还受 **Forge 事件总线**上的 `LootingLevelEvent` 影响，掠夺魔咒之外也多这一个入口。

### Additional Context Parameters

Forge 扩展了部分参数集，补上原本缺失的可用上下文：

- `LootContextParamSets#CHEST` 现在允许 `LootContextParams#KILLER_ENTITY` —— 因为箱子矿车是可以被破坏（即被「杀死」）的实体。
- `LootContextParamSets#FISHING` 同样允许 `LootContextParams#KILLER_ENTITY` —— 钓鱼钩也是玩家收杆时被「杀死」的实体。

### Multiple Items on Smelting

使用 `SmeltItemFunction` 时，熔炼配方现在返回**结果的实际数量**而不是单个熔炼物品（例：配方返回 3 个物品且有 3 个掉落，结果是 9 个熔炼物品而非 3 个）。

### Loot Table Id Condition

Forge 额外提供一个 `LootItemCondition`，让某些物品只在**指定表**里生成。通常用在 global loot modifiers 内。

```json
// In some loot pool or pool entry
{
  "conditions": [
    {
      "condition": "forge:loot_table_id",
      // Will apply when the loot table is for dirt
      "loot_table_id": "minecraft:blocks/dirt"
    }
  ]
}
```

### Can Tool Perform Action Condition

Forge 另提供一个 `LootItemCondition`，检查给定的 `LootContextParams#TOOL` 能否执行指定的 `ToolAction`。

```json
// In some loot pool or pool entry
{
  "conditions": [
    {
      "condition": "forge:can_tool_perform_action",
      // Will apply when the tool can strip a log like an axe
      "action": "axe_strip"
    }
  ]
}
```

## 数据生成

生成方式：构造 `LootTableProvider` 并提供 `LootTableProvider$SubProviderEntry`。provider 必须加到 `DataGenerator` 上。

```java
// On the MOD event bus
@SubscribeEvent
public void gatherData(GatherDataEvent event) {
    event.getGenerator().addProvider(
        // Tell generator to run only when server data are generating
        event.includeServer(),
        output -> new MyLootTableProvider(
          output,
          // Specify registry names of tables that are required to generate, or can leave empty
          Collections.emptySet(),
          // Sub providers which generate the loot
          List.of(subProvider1, subProvider2, /*...*/)
        )
    );
}
```

构造器三参从示例可读作：`HolderLookup.Provider`? ⇒ 页内此处**未标类型**，只给出实参顺序（output / 必生成表名集合 / sub provider 列表）⇒ `TODO(未核实)`：第二参与第三参的确切泛型（`Set<ResourceLocation>`、`List<LootTableProvider.SubProviderEntry>`）请按签名核实，别照抄我的猜测。

### `LootTableSubProvider`

每个 `LootTableProvider$SubProviderEntry` 收一个 `LootTableSubProvider`（负责生成表）以及一个给定的 `LootContextParamSet`。`LootTableSubProvider` 的方法接收 writer，类型 `BiConsumer<ResourceLocation, LootTable.Builder>`。

```java
public class ExampleSubProvider implements LootTableSubProvider {

  // Used to create a factory method for the wrapping Supplier
  public ExampleSubProvider() {}

  // The method used to generate the loot tables
  @Override
  public void generate(BiConsumer<ResourceLocation, LootTable.Builder> writer) {
    // Generate loot tables here by calling writer#accept
  }
}
```

表随后可加进 `LootTableProvider#getTables`，对应任意可用的 `LootContextParamSet`：

```java
// In the list passed into the LootTableProvider constructor
new LootTableProvider.SubProviderEntry(
  ExampleSubProvider::new,
  // Loot table generator for the 'empty' param set
  LootContextParamSets.EMPTY
)
```

### `BlockLootSubProvider` 与 `EntityLootSubProvider`

针对 `LootContextParamSets#BLOCK` 和 `#ENTITY`，有两个提供额外辅助方法的特化类型（分别 `BlockLootSubProvider`、`EntityLootSubProvider`），用于创建表并**校验是否所有对象都有表**。

`BlockLootSubProvider` 构造器收：一个物品列表（这些是**抗爆炸**的，用来判断方块被炸毁时能否生成掉落）+ 一个 `FeatureFlagSet`（决定该方块是否启用、从而是否为它生成表）。

```java
// In some BlockLootSubProvider subclass
public MyBlockLootSubProvider() {
  super(Collections.emptySet(), FeatureFlags.REGISTRY.allFlags());
}
```

`EntityLootSubProvider` 构造器收一个 `FeatureFlagSet`（决定该实体类型是否启用）。

```java
// In some EntityLootSubProvider subclass
public MyEntityLootSubProvider() {
  super(FeatureFlags.REGISTRY.allFlags());
}
```

> 注意上面两个示例的**第一参与文字描述不一致**：描述说 BlockLootSubProvider 收「一个物品列表 + FeatureFlagSet」，示例却传了两个实参且首参是 `Collections.emptySet()`。示例里泛型被省略 ⇒ `TODO(未核实)`，别据此推断参数类型。

要用它们，必须把所有已注册对象交给 `BlockLootSubProvider#getKnownBlocks` 或 `EntityLootSubProvider#getKnownEntityTypes`。这两个方法用于确保 iterable 里的**每个**对象都有一张表。

> **Tip（页内原文）**：若用 `DeferredRegister` 注册模组对象，`#getKnown*` 可以直接由 `DeferredRegister#getEntries` 供给：

```java
// In some BlockLootSubProvider subclass for some DeferredRegister BLOCK_REGISTRAR
@Override
protected Iterable<Block> getKnownBlocks() {
  return BLOCK_REGISTRAR.getEntries() // Get all registered entries
    .stream()                         // Stream the wrapped objects
    .flatMap(RegistryObject::stream)
    ::iterator;                      // Create the iterable
}
```

表本身通过在实现 `#generate` 来添加：

```java
// In some BlockLootSubProvider subclass
@Override
public void generate() {
  // Add loot tables here
}
```

### Builder 组件一览

表以 `LootTable$Builder` 形式被 `LootTableSubProvider` 接受；随后在 `LootTableProvider$SubProviderEntry` 里设定指定的 `LootContextParamSet`，并经 `#build` 构建。构建前 builder 可设定 entries、conditions、modifiers。

| 组件 | 创建 builder | 可用方法（页内点名） | 关联注册类型 |
| --- | --- | --- | --- |
| `LootTable` | `LootTable#lootTable` | `#withPool`（按给定顺序施加 pool）、`#apply`（修改这些 pool 结果的 function） | — |
| `LootPool` | `LootPool#lootPool` | `#add`（条目）、`#when`（条件）、`#apply`（function）、`#setRolls`（执行次数）、`#setBonusRolls`（受执行者 luck 影响的加成次数） | — |
| `LootPoolEntryContainer` | builder 子类型 `LootPoolEntryContainer$Builder` | `#append`（多个条目可同时执行）、`#then`（顺序执行直到一个失败）、`#otherwise`（失败时回退到另一条目） | `LootPoolEntryType`（需[注册]） |
| `LootItemCondition` | builder 子类型 `LootItemCondition$Builder` | 默认所有条件都必须为 true；`#or`（只需一个为 true）、`#invert`（取反结果） | `LootItemConditionType`（需[注册]） |
| `LootItemFunction` | builder 子类型 `LootItemFunction$Builder` | 修改执行结果后再传给输出 | `LootItemFunctionType`（需[注册]） |
| `NumberProvider` | — | 决定 pool 执行多少次 | `LootNumberProviderType`（需[注册]） |

「需[注册]」指的是页面里指向 `concepts_registries.md#registries-that-arent-forge-registries` 的链接锚点：这些类型**不走 Forge 的 registry**。具体注册写法本页没给 ⇒ 见下面「本档未覆盖」。

两个下挂的特化：

- **NbtProvider**：由 `CopyNbtFunction` 定义的一类特殊 function，规定从哪儿取 tag 信息。各自有 `LootNbtProviderType`。
- **ScoreboardNameProvider**：由 `ScoreboardValue` 定义的一类特殊 number provider，规定从哪个记分板名取执行次数。各自有 `LootScoreProviderType`。

`#build` 的返回类型（`LootTable` 还是别的）、以及 `validate` / `GsonProvider` 这类落盘工具类：见下面「本档未覆盖」，页内**零命中**。

## 本档未覆盖（禁止默写）

- **`GsonProvider` / `validate` / `JsonSaveProvider` 一类**：任务清单里提到的这些名字在本档两个页面里**一次都没出现**（已 grep 核实，`validate` / `GsonProvider` 均零命中）。要写就必须先在同档 `datagen` 索引页或 `concepts_registries.md` 找到出处，找不到就留空。
- **`Registries.*` 常量**：两页均未出现任何 `Registries.` 字样（grep 零命中）。上表那五个 `*Type` 只写了「有对应注册类型 + 链接到 registries 页的非 Forge registry 一节」，**注册进哪个 registry、用什么 API 都没给** ⇒ 禁止照 Fabric/NeoForge 习惯默写 `Registry.register(Registries.LOOT_TABLE, ...)`。
- **方块/物品如何绑定掉落表**：`Block#getLootTable`、`blocks/<name>.json` 的 loot 字段一类，两页都没出现。这是本主题最常见的实际问题，本档语料撑不住 ⇒ 需要 `get_minecraft_source` 或另找页面。
- 具体 pool / entry / condition / function 子类型清单（例如 `SetCountFunction`、`LootItemKilledByPlayerCondition`、各种 `*Provider`）：datagen 页明说「不在本文覆盖范围，请用 IDE 自查实现」。本页除 `SmeltItemFunction`、`CopyNbtFunction`、`ScoreboardValue` 外未点名任何一个 ⇒ 不写。
- `rolls` / `entries` / `functions` 等 loot table JSON 的完整字段面：页内只出现 `name`、`rolls`、`entries`、`conditions` 四个键的片段，格式细节指向 Minecraft Wiki `Loot_table`，本仓未入库。
- `LootTableProvider` 构造器参数类型、`#getTables` 的签名：只有示例调用，无签名。
- `LootingLevelEvent` 的 handler 写法与事件参数：页内只给类名。

## 相关

- 注册（含「不属于 Forge registry 的注册表」一节，即上表那五个 `*Type` 的去处）：`01-registry.mdc`、`mc-registry`；同档页 `data/forge_1.20.1/forge-docs/1.20.1/processed/concepts_registries.md`
- 数据生成接线（`GatherDataEvent` / `DataGenerator#addProvider`）：`07-datagen.mdc`、`mc-datagen`、`mc-datapack`
- 修改掉落要走 GLM，不要取消加载事件：同档页 `resources_server_glm.md`、`datagen_server_glm.md`
- 进度奖励里的 `loot` 字段：同档 `mc-advancement`
- 反模式：`09-anti-patterns.mdc`、`forge/1.20.1/knowledge/antipatterns/registry.md`
- 全文核对：`search_forge_docs(version="1.20.1", query="loot table")` → 上面点名的两个页面 id
