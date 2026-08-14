---
description: 01 — 注册系统
---

# 01 — 注册系统

> 适用版本：Forge 1.13.2
> **本文件最重要，所有注册相关操作必须先读本文件。**

---

## 约束

### 核心原则

- **禁止**通过 `new` 构造函数直接创建并注册方块/物品/实体
- 所有注册必须通过 **Forge 事件系统**（使用 `RegistryEvent.Register<T>`）
- mod ID 必须与 `mods.toml` 中的 `modId` 完全一致
- **必须使用 `@EventBusSubscriber` + `@SubscribeEvent`**：这是 Forge 1.13.2 的标准注册方式
- `DeferredRegister` 在 Forge 1.13.2 中**不可用**，必须使用 `RegistryEvent.Register<T>`

### 注册时机

`@SubscribeEvent` 方法在对应的 `RegistryEvent.Register<T>` 触发时执行注册逻辑。

| 注册内容 | 事件类型 | 示例方法签名 |
|----------|----------|--------------|
| 方块 | `RegistryEvent.Register<Block>` | `onBlocksRegistry(RegistryEvent.Register<Block> event)` |
| 物品 | `RegistryEvent.Register<Item>` | `onItemsRegistry(RegistryEvent.Register<Item> event)` |
| 方块实体 | `RegistryEvent.Register<Block>` | 同上（在 Block 注册时关联） |
| 实体类型 | `RegistryEvent.Register<EntityType>` | `onEntitiesRegistry(RegistryEvent.Register<EntityType> event)` |
| 附魔 | `RegistryEvent.Register<Enchantment>` | `onEnchantmentsRegistry(...)` |
| 粒子类型 | `RegistryEvent.Register<ParticleType>` | `onParticlesRegistry(...)` |
| 声音事件 | `RegistryEvent.Register<SoundEvent>` | `onSoundsRegistry(...)` |

### mod ID 规范

```java
// ✅ 正确：在 mods.toml 中声明的 mod ID
private static final String MOD_ID = "examplemod";

// ❌ 错误：硬编码或不一致
private static final String MOD_ID = "example_mod";  // 下划线不能用在 resource locations
private static final String MOD_ID = "ExampleMod";    // 不能大写
```

### RegistryObject 使用规范

Forge 1.13.2 不支持 `DeferredRegister`，使用**静态字段 + RegistryEvent**：

```java
// ✅ 正确：使用静态字段持有注册对象
public static final Block MY_BLOCK = new Block(...);

// ❌ 禁止：直接 public static final 但不调用 setRegistryName
public static final Block MY_BLOCK = new Block(...);  // 不会被注册系统管理
```

### 注册名称规范

```java
// ✅ 正确：使用 ResourceLocation 设置注册名
event.getRegistry().register(
    MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_awesome_block"))
);

// ❌ 错误：驼峰命名
MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "myAwesomeBlock"));

// ❌ 错误：大写开头
MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "MyAwesomeBlock"));

// ❌ 错误：使用横杠
MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my-awesome-block"));
```

---

## Decision Flow

### Decision: 选择注册方式

```
IF 注册 方块 / 物品 / 实体 / 方块实体 / 附魔 / 粒子 / 声音等标准内容
  → 使用 @EventBusSubscriber + RegistryEvent.Register<T>（标准方式）

IF 注册自定义 Registry
  → 使用 RegistryEvent.NewRegistry

IF 平台 = Fabric
  → 跳转 fabric/1.13.2/AGENTS.md（Fabric 使用 Registry.register() in onInitialize）

IF 平台 = NeoForge
  → 不要读本 Forge 规则。list_neoforge_versions 锁定精确版本后读 neoforge/<ver>/AGENTS.md。未建档版本（1.20.1/1.20.6/1.21.5/1.21.10）禁止读邻档 00–10，改口 search_neoforge_docs。
```

### Decision: 注册什么类型？

```
IF 注册 方块
  → 在 RegistryEvent.Register<Block> 中调用 event.getRegistry().register()
  → 使用 setRegistryName 设置注册名
  → 如需物品形态，在 RegistryEvent.Register<Item> 中注册同名 BlockItem

IF 注册 物品
  → 在 RegistryEvent.Register<Item> 中调用 event.getRegistry().register()
  → 使用 setRegistryName 设置注册名

IF 注册 方块实体（BlockEntity）
  → 方块实现 ITileEntityProvider，重写 createNewTileEntity()
  → 不需要单独注册 BlockEntity 类型（在方块关联时注册）

IF 注册 实体（Entity）
  → 在 RegistryEvent.Register<EntityType> 中注册 EntityType
  → 必须在 mods.toml 中声明 entity 字段

IF 注册 其他内容（附魔/粒子/声音等）
  → 确认对应的 Registry 类型
  → 查找 Forge 源码或文档确认类名
```

### Decision: 注册顺序（依赖关系）

```
IF 一个方块有对应的 ItemBlock
  → 必须先注册 Block，再注册 ItemBlock
  → ItemBlock 的 registry name 必须与 Block 完全相同

IF 一个方块有 BlockEntity
  → 必须先注册 Block，再创建关联的 BlockEntity
  → Block 的 registry name 必须与 BlockEntity 关联的 Block 匹配
```

### Decision: 常见 Registry 报错处理

```
IF 报错 "No such registry"
  → 检查 Registry 类型是否正确

IF 报错 "Resource location ... is invalid"
  → 检查 registry name 是否全小写，是否包含非法字符

IF 报错 "Registry name must be in namespace:name format"
  → 使用 ResourceLocation 并指定 namespace

IF 运行时物品/方块显示为紫色黑色方块（缺失模型）
  → 这是正常的注册成功但缺少资源文件，不是注册问题
```

---

## 示例：完整注册流程

### 方式一：所有内容集中在 ExampleMod（适合小模组）

```java
@Mod(ExampleMod.MOD_ID)
public class ExampleMod {
    public static final String MOD_ID = "examplemod";
    private static final Logger LOGGER = LogManager.getLogger();

    // 创建静态字段持有注册对象
    public static final Block MY_BLOCK = new Block(
        Block.Properties.create(Material.STONE)
            .hardnessAndResistance(1.5f, 6.0f)
    );

    // BlockItem 与方块同名
    public static final Item MY_BLOCK_ITEM = new ItemBlock(MY_BLOCK,
        new Item.Properties().group(ItemGroup.TAB_BUILDING_BLOCKS));

    public static final Item MY_ITEM = new Item(
        new Item.Properties().group(ItemGroup.TAB_MISC).maxStackSize(64)
    );

    public ExampleMod() {
        LOGGER.info("ExampleMod constructed");
        MinecraftForge.EVENT_BUS.register(this);
    }

    // 注册方块
    @SubscribeEvent
    public void onBlocksRegistry(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            MY_BLOCK.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
        );
    }

    // 注册物品（包括 BlockItem）
    @SubscribeEvent
    public void onItemsRegistry(RegistryEvent.Register<Item> event) {
        event.getRegistry().register(
            MY_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "my_item"))
        );
        event.getRegistry().register(
            MY_BLOCK_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "my_block"))
        );
    }
}
```

> 注意：
> - 使用 `@Mod.EventBusSubscriber` 或在构造函数中 `MinecraftForge.EVENT_BUS.register(this)`
> - `RegistryEvent.Register<T>` 在正确的时机自动触发
> - BlockItem 与方块使用相同 registry name，Forge 自动关联

---

## Forge 1.13.2 注册方式对比

| 特性 | `@EventBusSubscriber` + `RegistryEvent` | `@Mod.EventBusSubscriber` |
|------|----------------------------------------|---------------------------|
| 代码风格 | 事件监听回调中手动注册 | 同上，但使用注解自动订阅 |
| mod ID 前缀 | 需手动 `new ResourceLocation(MOD_ID, "name")` | 同上 |
| IDE 补全 | 一般 | 一般 |
| 适用场景 | 所有标准 Forge 注册 | 所有标准 Forge 注册 |
| 官方推荐 | **是**（1.13.2 标准方式） | 同上 |

> **注意**：`DeferredRegister` 在 Forge 1.13.2 中**不可用**。如需类似功能，需要等待 Forge 1.14+。
