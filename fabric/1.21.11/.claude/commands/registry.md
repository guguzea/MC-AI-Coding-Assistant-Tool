# Fabric 注册系统命令参考

本文件描述 Fabric 1.21.11 平台上进行注册系统（Registry）开发时所需掌握的核心 API 和常用命令。

## 核心原则

Fabric 的注册系统比 Forge 简单直接：所有注册都在 `onInitialize()` 阶段通过 `Registry.register()` 方法完成，没有 modEventBus、没有 `RegisterEvent`、没有 `DeferredRegister`。注册是**静态**的，一旦注册成功就会存在于整个游戏生命周期。注册失败的唯一原因是 mod 初始化失败，不会出现延迟注册导致的"找不到注册对象"问题。

## Registry.register() 命令

### 基本语法命令

`Registry.register()` 是 Fabric 中最核心的注册方法：

```java
Registry.register(Registry<T> registry, Identifier id, T object)
```

- `registry`：要注册到的注册表（如 `Registries.BLOCK`、`Registries.ITEM`）
- `id`：对象的唯一标识符，使用 `Identifier` 构造
- `object`：要注册的实际对象实例

返回类型是 `T`（传入的对象类型），但实际返回 `RegistryReference<T>`，可以使用 `RegistrySupplier<T>` 包装以获得更好的 IDE 支持。

### 注册表示例命令

```java
// 注册物品
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), new Item(new Item.Settings()));

// 注册方块
Registry.register(Registries.BLOCK, new Identifier(MOD_ID, "my_block"), new Block(FabricBlockSettings.create()));

// 注册实体类型
Registry.register(Registries.ENTITY_TYPE, new Identifier(MOD_ID, "my_entity"), EntityType.Builder.create(...).build());
```

### RegistrySupplier 包装命令

推荐使用 `RegistrySupplier` 包装注册结果：

```java
private static final RegistrySupplier<Item> MY_ITEM =
    Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), new Item(new Item.Settings()));

// 使用 .get() 获取实际对象
Item item = MY_ITEM.get();

// 使用 .getId() 获取 Registry ID
Identifier id = MY_ITEM.getId();
```

`RegistrySupplier` 提供了懒加载和 null 安全的优势，IDE 可以追踪引用关系。

## Identifier 构造命令

### 基本构造命令

`Identifier` 是 Minecraft 资源定位的核心类型，由命名空间和路径两部分组成：

```java
Identifier id = new Identifier("minecraft", "diamond");  // minecraft:diamond
Identifier id = new Identifier(MOD_ID, "my_item");       // modid:my_item
```

- 命名空间（namespace）：通常使用 mod ID，自带 `minecraft` 命名空间给原版使用
- 路径（path）：资源名称，使用小写字母和下划线

### 构造规范命令

正确的 `Identifier` 构造必须遵守以下规范：

```java
// ✅ 正确：全小写、下划线分隔
new Identifier("examplemod", "my_awesome_item")

// ❌ 错误：驼峰命名
new Identifier("examplemod", "myAwesomeItem")

// ❌ 错误：连字符
new Identifier("examplemod", "my-awesome-item")

// ❌ 错误：大写
new Identifier("examplemod", "My_Item")
```

违反规范会导致资源定位失败，游戏加载时显示警告或错误。

## 常用注册表命令

### Registries 枚举命令

`Registries` 类包含所有可用的注册表类型：

```java
Registries.BLOCK           // 方块
Registries.ITEM           // 物品
Registries.ENTITY_TYPE     // 实体类型
Registries.PARTICLE_TYPE   // 粒子类型
Registries.SOUND_EVENT    // 声音事件
Registries.MOB_EFFECT     // 状态效果
Registries.BLOCK_ENTITY_TYPE  // 方块实体类型
Registries.ENCHANTMENT    // 附魔
Registries.ITEM_GROUP     // 物品栏分组
Registries.POTION         // 药水
Registries.SCREEN_HANDLER // 屏幕处理器
Registries.FLUID         // 流体
Registries.FLUID_TYPE    // 流体类型
```

每种注册内容类型都有对应的注册表。

## mod ID 管理命令

### MOD_ID 常量定义命令

强烈建议在 mod 主类中定义 `MOD_ID` 常量：

```java
public class ExampleMod implements FabricMod {
    private static final String MOD_ID = "examplemod";
    
    // 其他类中也可以使用
    private static final RegistrySupplier<Item> MY_ITEM = 
        Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), new Item(...));
}
```

这样可以确保整个 mod 使用统一的 mod ID，减少拼写错误。

### 跨类引用 MOD_ID 命令

如果多个类需要访问 `MOD_ID`，有两种方式：

1. 定义为 public static final：
```java
public static final String MOD_ID = "examplemod";
```

2. 通过接口提供：
```java
public interface ModConstants {
    String MOD_ID = "examplemod";
}
// 其他类实现该接口
```

## 注册顺序命令

### 依赖注册命令

某些注册的顺序很重要：

```java
// 1. 先注册方块
private static final RegistrySupplier<Block> MY_BLOCK = 
    Registry.register(Registries.BLOCK, new Identifier(MOD_ID, "my_block"), new Block(...));

// 2. 再注册方块物品（依赖方块）
private static final RegistrySupplier<Item> MY_BLOCK_ITEM = 
    Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_block"), 
        new BlockItem(MY_BLOCK.get(), new Item.Settings()));
```

`BlockItem` 构造函数接受 `Block` 实例，所以方块必须先注册。由于注册在同一个 `onInitialize()` 中执行，静态字段会按代码顺序初始化。

### BlockEntityType 注册命令

`BlockEntityType` 依赖 `Block`：

```java
// 方块
private static final RegistrySupplier<Block> MY_BLOCK = 
    Registry.register(Registries.BLOCK, ...);

// 方块实体类型
private static final RegistrySupplier<BlockEntityType<MyBlockEntity>> MY_BLOCK_ENTITY = 
    Registry.register(Registries.BLOCK_ENTITY_TYPE, new Identifier(MOD_ID, "my_block"),
        BlockEntityType.Builder.create(MyBlockEntity::new, MY_BLOCK.get()).build(null));
```

`BlockEntityType.Builder.create()` 的第一个参数是 `BlockEntity` 构造函数引用，后续参数是支持该 `BlockEntity` 的方块列表。

## RegistryObject vs RegistrySupplier 命令

Fabric 同时提供了 `RegistryObject`（Fabric API 提供）和 `RegistrySupplier`（Fabric Loader 提供）两种引用包装：

```java
// Fabric Loader 提供
private static final RegistrySupplier<Item> ITEM = 
    Registry.register(Registries.ITEM, id, new Item(...));

// Fabric API 提供（需要添加 fabric-api 依赖）
private static final RegistryObject<Item> ITEM = 
    RegistryObject.create(id, Registries.ITEM, MOD_ID);
```

两者功能相似，`RegistrySupplier` 是更现代的选择，与 Loom 集成更好。

## 动态注册命令

### FabricRegistryBuilder 自定义注册表命令

如果需要创建自定义注册表（用于自定义配置数据）：

```java
public static final Registry<MyData> MY_DATA = 
    FabricRegistryBuilder.createSimple(
        new Identifier(MOD_ID, "my_data")
    ).attribute(ClientRegistryHolder.class).register();

private static final RegistrySupplier<MyData> MY_FIRST_DATA = 
    Registry.register(MY_DATA, new Identifier(MOD_ID, "first_data"), new MyData(...));
```

自定义注册表可以存储任何实现了 `Factory` 接口的对象。

## 注册验证命令

### 注册检查命令

调试时可以检查注册是否成功：

```java
@Override
public void onInitialize() {
    Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), new Item(...));
    
    // 检查注册是否成功
    Item registered = Registries.ITEM.get(new Identifier(MOD_ID, "my_item"));
    if (registered != null) {
        LOGGER.info("Item registered successfully: " + registered.getTranslationKey());
    }
}
```

如果注册失败（如 ID 冲突），`get()` 会返回 `null` 或抛出异常。
