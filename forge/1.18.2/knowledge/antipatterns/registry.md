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
| `BLOCKENTITIES` | `BLOCK_ENTITY_TYPES` |
| `ENTITYTYPES` | `ENTITY_TYPES` |
| `CONTAINERS` | `MENU_TYPES` |
| `FLUIDTYPES` | `FLUID_TYPES` |

```java
// ✅ Forge 1.18.2
DeferredRegister.create(ForgeRegistries.BLOCKENTITIES, MOD_ID)
DeferredRegister.create(ForgeRegistries.ENTITYTYPES, MOD_ID)
DeferredRegister.create(ForgeRegistries.CONTAINERS, MOD_ID)
DeferredRegister.create(ForgeRegistries.FLUIDTYPES, MOD_ID)
```
