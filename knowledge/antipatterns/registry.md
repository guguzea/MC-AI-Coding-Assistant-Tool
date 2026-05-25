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

**正则检查：** `/^[a-z][a-z0-9_]{0,63}$/`

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

**症状：** mod 在游戏中加载但无法启动；`modid does not match` 错误

```java
// mods.toml 中
modId="mymod"

// Java 中
public static final String MOD_ID = "mymod123";  // ❌ 不一致
```

**正确方案：** 始终在 `gradle.properties` 中定义 `mod_id`，其他地方引用该值，不要重复硬编码。

---

## 错误：在 EntityType 中使用 Direction.DISPENSER

**症状：** 编译错误或运行时崩溃

```java
// ❌ 错误
EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
    .build(Direction.DISPENSER, "my_entity");  // Direction 不存在
```

**正确方案：**
```java
// ✅ 直接传入 String
EntityType.Builder.of(MyEntity::new, MobCategory.CREATURE)
    .build("my_entity");
```

---

## 错误：使用 RegistryEvent.Register 方式注册实体（1.20.x）

**症状：** 实体不在游戏中生成

**说明：** 在 1.18+ 的 Forge 中，实体注册有两个时期：
1. `NewRegistryEvent` → 创建 Registry
2. `RegisterEvent<EntityType<?>>` → 注册实体

使用 DeferredRegister 可以省略这些细节，直接注册到 modEventBus。

**正确方案：**
```java
public static final DeferredRegister<EntityType<?>> ENTITY_TYPES =
    DeferredRegister.create(ForgeRegistries.ENTITY_TYPES, MOD_ID);

public static final RegistryObject<EntityType<MyEntity>> MY_ENTITY = ENTITY_TYPES.register(...);

// 在 mod 构造函数中
ENTITY_TYPES.register(modEventBus);
```
