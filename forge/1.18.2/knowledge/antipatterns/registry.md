# 注册相关反模式

## 错误：在 lambda 外部引用 RegistryObject

**症状：** `NullPointerException` 或 `RegistryObject.get() returns null`

```java
// ❌ 错误
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item", () -> new Item());
public static final ItemStack STACK = new ItemStack(MY_ITEM.get()); // NPE! MY_ITEM 尚未初始化
```

**原因：** `RegistryObject` 在静态初始化时为 null，只有在 `register(modEventBus)` 之后才有值。

**正确方案：**
```java
// ✅ 在 RegistryObject 的 lambda 内部引用（延迟到注册完成后）
public static final RegistryObject<Item> MY_ITEM = ITEMS.register("my_item",
    () -> new Item(new Item.Properties().stacksTo(64).tab(CreativeModeTab.TAB_MISC))
);

// ✅ 或者在 modEventBus 回调中使用
modEventBus.addListener(event -> {
    ItemStack stack = new ItemStack(MY_ITEM.get()); // 此时已注册完成
});
```

---

## 错误：Registry 名称使用大写或横杠

**症状：** 注册后物品/方块在游戏中不存在

```java
// ❌ 错误
BLOCKS.register("MyBlock", () -> new Block(...));       // 大写
BLOCKS.register("my-block", () -> new Block(...));     // 横杠
ITEMS.register("My_Block", () -> new BlockItem(...));  // 大写下划线混合
```

**正确方案：**
```java
// ✅ 全小写、下划线分隔
BLOCKS.register("my_block", () -> new Block(...));
ITEMS.register("my_block", () -> new BlockItem(MY_BLOCK.get(), ...));
```

---

## 错误：忘记注册 DeferredRegister

**症状：** 注册对象在游戏中不存在，但无任何异常

```java
// ❌ 忘记
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);
public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block", ...);
// mod 构造函数中没有：BLOCKS.register(modEventBus)
```

**正确方案：**
```java
public ExampleMod(FMLJavaModLoadingContext context) {
    IEventBus modEventBus = context.getModEventBus();
    BLOCKS.register(modEventBus);   // ← 必须
    ITEMS.register(modEventBus);   // ← 必须
}
```

---

## 错误：硬编码 mod ID

**症状：** 注册的物品/方块出现在错误 namespace 下

```java
// ❌ 错误
BLOCKS.register("example_block", () -> new Block(...));
// 会注册到 minecraft:example_block（默认 namespace）
```

**正确方案：**
```java
// ✅ DeferredRegister.create 的第二个参数是 modId，所有注册自动使用该 namespace
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);
// MOD_ID = "examplemod" → 注册到 examplemod:example_block
```

---

## 错误：mod ID 与 mods.toml 不一致

**症状：** mod 在游戏中加载但无法启动

```java
// mods.toml 中
modId="mymod"

// Java 中
public static final String MOD_ID = "mymod123";  // ❌ 不一致
```

---

## 错误：EntityType.Builder 使用 Direction 参数

**症状：** 编译错误或运行时崩溃

```java
// ❌ 错误（Forge 1.18.x 已移除 Direction 参数）
EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
    .build(Direction.DISPENSER, "my_entity");  // Direction 不存在

// ✅ 正确：直接传入 String
EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
    .build("my_entity");
```

---

## ForgeRegistries 字段名（1.18.2 vs 1.20.x）

| 1.18.2 字段 | 1.20.x 字段 |
|------------|-------------|
| `BLOCK_ENTITIES` | `BLOCK_ENTITY_TYPES` |
| `ENTITIES` | `ENTITY_TYPES`（1.19 起改名） |
| `CONTAINERS` | `MENU_TYPES` |
| **无「流体类型」注册表**：`FLUIDTYPES` 与 `FLUID_TYPES` 在 1.18.2 **都不存在**（一手坐实，见下注），流体走 `FLUIDS` | `FLUID_TYPES`（**1.19+** 随 `FluidType` 才存在） |

> **本表流体那一行的取证状态（2026-09-24 一手坐实，勿删）**
>
> - 本仓 `data/**` 语料逐字支撑的 `ForgeRegistries` 字段**仍只有** `BLOCKS` / `ITEMS`（`data/forge_1.18.2/forge-docs/1.18.2/processed/concepts_registries.md:24,96`）；`data/**` 是上游逐字语料，本档不改它一个字节。左列 `BLOCK_ENTITIES`（与 `ENTITIES`、`CONTAINERS`、`SOUND_EVENTS`、`PARTICLE_TYPES` 一样）现已由**官方构件逐字**坐实（见下条）。
> - **已裁定，冲突判给禁令侧**：本表旧左列把 `FLUIDTYPES` 当 1.18.2 正名，而本包 `.cursor/skills/mc-fluid/SKILL.md:22`、`:102` 把**同一个写法**列成 ❌ 禁令（主张 1.18.2 无 `FluidType`，流体走 `FluidAttributes` + 下方 ✅ 示例里的 `ForgeRegistries.FLUIDS`）。**禁令侧被证实**：1.18.2 既没有 `FLUIDTYPES`、也没有 `FLUID_TYPES`——该版本根本没有「流体类型」注册表。⇒ 修法是删/改写该行，**不是**改名成 `FLUID_TYPES`（那只是把一个错名换成另一个错名）。
> - **证据（两 build、两机制互证，as-of 2026-09-24）**：官方 1.18.2-40.1.80 **源码** `ForgeRegistries.java` 全文 157 行，`grep FLUID` 只命中 `:58` 的 `FLUIDS` 字段与 `:104` 的 `Keys.FLUIDS`；官方 1.18.2-40.3.12 **universal jar** 的 `javap -p` 输出 41 行、注册表字段共 **32** 个，按 `FLUIDTYPES|FLUID_TYPES` 过滤 = **0** 命中（在全分母上测得，非抽查）。档位 = **外部-only（官方构件逐字，仓内无副本）**，比旧记的「处方-only」高一级：jar 在盘、sha 可复核，但构件**不入库** ⇒ 复核需自备 jar。
> - 坐实入口（**已验证可用**，两条各一行，把 `<…>` 换成本地路径）：
>   `unzip -p <forge-1.18.2-40.1.80-sources.jar> net/minecraftforge/registries/ForgeRegistries.java`
>   `javap -p -classpath <forge-1.18.2-40.3.12-universal.jar> net.minecraftforge.registries.ForgeRegistries`（需 JDK 17+）
>   ⚠️ `query_loader_api` / `ingest_loader_api` 摘要面的 `fields` 恒 0、且不含 `ForgeRegistries` 类 ⇒ 对字段名**无取证能力**，不要用 ingest 去「复现」本结论。

```java
// ✅ Forge 1.18.2
DeferredRegister.create(ForgeRegistries.BLOCK_ENTITIES, MOD_ID)
DeferredRegister.create(ForgeRegistries.ENTITIES, MOD_ID)
DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID)
DeferredRegister.create(ForgeRegistries.FLUIDS, MOD_ID)
```
