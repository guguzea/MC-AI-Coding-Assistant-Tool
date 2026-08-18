---
description: 01 — 注册系统
---

# 01 — 注册系统

> 适用版本：Forge 1.12.2
> **本文件最重要，所有注册相关操作必须先读本文件。**
> **注意：Forge 1.12.2 没有 DeferredRegister，必须使用 @EventBusSubscriber + RegistryEvent。**

---

## 约束

### 核心原则

- **禁止**通过 `new` 构造函数直接创建并注册方块/物品/实体
- 所有注册必须通过 **Forge 事件系统**（`RegistryEvent.Register<T>`）
- mod ID 必须与 `mcmod.info` 中的 `modid` 完全一致
- **使用 `@EventBusSubscriber` + `RegistryEvent.Register<T>`**：Forge 1.12.2 没有 `DeferredRegister`

### 注册时机

使用 `@EventBusSubscriber(bus = EventBusSubscriber.Bus.FORGE)` 订阅 `RegistryEvent.Register<T>`。

### mod ID 规范

```java
// ✅ 正确：在 mcmod.info 中声明的 mod ID
public static final String MODID = "examplemod";

// ❌ 错误：含大写，或与 mods.toml / mcmod.info 的 modId 不一致（下划线合法；Forge modId 不能用连字符）
private static final String MODID = "ExampleMod";    // 不能大写
```

### 注册名称规范

```java
// ✅ 正确：全小写，下划线分隔
event.getRegistry().register(new Block().setRegistryName(MODID, "my_awesome_block"));

// ❌ 错误：驼峰命名
event.getRegistry().register(new Block().setRegistryName(MODID, "myAwesomeBlock"));

// ❌ 错误：大写开头
event.getRegistry().register(new Block().setRegistryName(MODID, "MyAwesomeBlock"));

// ❌ 错误：使用横杠
event.getRegistry().register(new Block().setRegistryName(MODID, "my-awesome-block"));
```

---

## Decision Flow

### Decision: 选择注册方式

```
IF 注册 方块 / 物品 / 实体 等标准内容
  → 使用 @EventBusSubscriber + RegistryEvent.Register<T>

IF 注册 方块实体
  → 使用 RegistryEvent.Register<BlockEvent> 或单独的注册

IF 平台 = Fabric
  → 跳转 fabric/1.12.2/AGENTS.md（Fabric 使用 Registry.register() in onInitialize）

IF 平台 = NeoForge
  → 不要读本 Forge 规则。list_neoforge_versions 锁定精确版本后读 neoforge/<ver>/AGENTS.md。未建档版本（1.20.1/1.20.6/1.21.5/1.21.10）禁止读邻档 00–10，改口 search_neoforge_docs。
```

### Decision: 注册什么类型？

```
IF 注册 方块
  → @EventBusSubscriber + RegistryEvent.Register<Block>
  → 使用 event.getRegistry().register(new Block().setRegistryName(...))

IF 注册 物品
  → @EventBusSubscriber + RegistryEvent.Register<Item>
  → 使用 event.getRegistry().register(new Item().setRegistryName(...))

IF 注册 方块实体类型
  → @EventBusSubscriber + RegistryEvent.Register<BlockEvent>

IF 注册 实体类型
  → @EventBusSubscriber + RegistryEvent.Register<EntityEntry>

IF 注册 其他内容（附魔/粒子/声音等）
  → 确认对应的 Registry 类型
```

### Decision: 常见 Registry 报错处理

```
IF 报错 "No such registry"
  → 检查 Registry 类型是否正确

IF 报错 "Resource location ... is invalid"
  → 检查 registry name 是否全小写，是否包含非法字符

IF 运行时物品/方块显示为紫色黑色方块（缺失模型）
  → 这是正常的注册成功但缺少资源文件，不是注册问题
```

---

## 示例：完整注册流程

### 方式一：使用 @EventBusSubscriber 注册（推荐）

```java
// com/example/mod/registry/ModBlocks.java
@EventBusSubscriber(modid = ExampleMod.MODID, bus = EventBusSubscriber.Bus.FORGE)
public class ModBlocks {
    public static Block EXAMPLE_BLOCK;

    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        EXAMPLE_BLOCK = new Block(Material.ROCK)
                .setHardness(1.5F)
                .setResistance(6.0F)
                .setRegistryName(ExampleMod.MODID, "example_block");
        event.getRegistry().register(EXAMPLE_BLOCK);
    }
}
```

```java
// com/example/mod/registry/ModItems.java
@EventBusSubscriber(modid = ExampleMod.MODID, bus = EventBusSubscriber.Bus.FORGE)
public class ModItems {
    public static Item EXAMPLE_ITEM;
    public static Item EXAMPLE_BLOCK_ITEM;

    @SubscribeEvent
    public static void registerItems(RegistryEvent.Register<Item> event) {
        // 普通物品
        EXAMPLE_ITEM = new Item()
                .setRegistryName(ExampleMod.MODID, "example_item")
                .setTranslationKey(ExampleMod.MODID + ".example_item");
        event.getRegistry().register(EXAMPLE_ITEM);

        // 方块物品
        EXAMPLE_BLOCK_ITEM = new ItemBlock(ModBlocks.EXAMPLE_BLOCK)
                .setRegistryName(ExampleMod.MODID, "example_block");
        event.getRegistry().register(EXAMPLE_BLOCK_ITEM);
    }
}
```

### 方式二：在 @Mod 类中注册（不推荐，仅用于简单模组）

```java
@Mod(ExampleMod.MODID)
public class ExampleMod {
    public static final String MODID = "examplemod";

    @Instance(ExampleMod.MODID)
    public static ExampleMod instance;

    @SidedProxy(clientSide = "com.example.mod.proxy.ClientProxy", serverSide = "com.example.mod.proxy.CommonProxy")
    public static CommonProxy proxy;

    // 直接在静态字段中创建并注册
    public static final Block MY_BLOCK = new Block(Material.ROCK)
            .setRegistryName(MODID, "my_block");

    @EventHandler
    public void init(FMLInitializationEvent event) {
        // 注册到游戏
        RegistryHandler.init();
    }
}
```

---

## 注册方式对比

| 特性 | `@EventBusSubscriber` + `RegistryEvent`（推荐） | 在 @Mod 类中注册 |
|------|---------------------------------------------------|----------------|
| 代码风格 | 静态方法，集中在类中 | 分散在 @Init 方法中 |
| mod ID 前缀 | 需手动 `setRegistryName(MODID, "name")` | 需手动 |
| IDE 补全 | 一般 | 一般 |
| 适用场景 | 所有标准 Forge 注册 | 简单模组 |

> 注意：Forge 1.12.2 没有 `DeferredRegister`，所有注册都必须通过 `RegistryEvent`。
