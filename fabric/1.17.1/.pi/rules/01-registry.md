---
description: 01 — 注册系统
---

# 01 — 注册系统

> 适用版本：Fabric 1.17.1
> **本文件最重要，所有注册相关操作必须先读本文件。**

---

## 约束

### 核心原则

- **禁止**通过 `new` 构造函数直接创建并注册方块/物品/实体
- **所有注册**必须在 `onInitialize()` 方法（或 entrypoint）中通过 `Registry.register()` 执行
- Fabric **没有** modEventBus，所有注册直接调用 `Registry`
- mod ID 必须与 `fabric.mod.json` 中的 `id` 完全一致
- 使用 `Identifier` 构造 `ResourceLocation`：`new Identifier(MOD_ID, "registry_name")`

### 注册时机

> ⚠️ **1.17.x 重要区别**：1.17.x 没有 `Registries` 类！使用 `Registry.BLOCK`、`Registry.ITEM` 等**静态字段**。

| 注册内容 | API | 代码位置 |
|---------|-----|---------|
| 方块 | `Registry.register(Registry.BLOCK, id, block)` | `onInitialize()` |
| 物品 | `Registry.register(Registry.ITEM, id, item)` | `onInitialize()` |
| 方块实体 | `Registry.register(Registry.BLOCK_ENTITY_TYPE, id, type)` | `onInitialize()` |
| 实体类型 | `Registry.register(Registry.ENTITY_TYPE, id, type)` | `onInitialize()` |
| 粒子类型 | `Registry.register(Registry.PARTICLE_TYPE, id, type)` | `onInitialize()` |
| 声音事件 | `Registry.register(Registry.SOUND_EVENT, id, soundEvent)` | `onInitialize()` |
| 附魔 | `Registry.register(Registry.ENCHANTMENT, id, enchantment)` | `onInitialize()` |
| 流体 | `Registry.register(Registry.FLUID, id, fluid)` | `onInitialize()` |

### mod ID 规范

```java
// ✅ 正确：在 fabric.mod.json 中声明的 mod ID
private static final String MOD_ID = "examplemod";

// ❌ 错误：硬编码或不一致
private static final String MOD_ID = "example_mod";  // 下划线不能用在 resource locations
private static final String MOD_ID = "ExampleMod";    // 不能大写
```

### 注册名称规范

```java
// ✅ 正确：全小写，下划线分隔
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_awesome_item"), myItem);

// ❌ 错误：驼峰命名
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "myAwesomeItem"), myItem);

// ❌ 错误：使用横杠
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my-awesome-item"), myItem);
```

---

## Decision Flow

### Decision: 选择注册方式

```
IF 注册 方块 / 物品 / 实体 / 方块实体 / 附魔 / 粒子 / 声音等标准内容
  → 使用 Registry.register() 在 onInitialize() 中执行
  → ⚠️ 1.17.x 使用 Registry.ITEM / Registry.BLOCK（静态字段），不是 Registries.ITEM

IF 注册 方块实体类型
  → Registry.register(Registry.BLOCK_ENTITY_TYPE, id, BlockEntityType)
  → 方块的 blockEntityType 属性指向该 BlockEntityType

IF 注册 Mixin
  → 在 fabric.mixins.json 中声明，不需要在 onInitialize() 中注册

IF 平台 = Forge
  → 跳转 ../forge/1.17.1/AGENTS.md（Forge 使用 DeferredRegister）
```

### Decision: 注册顺序（依赖关系）

```
IF 一个方块有对应的 ItemBlock
  → 必须先注册 Block，再注册 ItemBlock
  → ItemBlock 的 registry name 必须与 Block 完全相同

IF 一个方块有 BlockEntity
  → 必须先注册 Block，再注册 BlockEntityType
  → 方块的 BlockEntityProvider 接口提供 BlockEntity 实例

IF 一个物品有 Fabric API Capability
  → Capability 注册应在 onInitialize() 中通过 Fabric API 处理
```

---

## 示例：完整注册流程

### 方式一：所有内容集中在 ExampleMod（适合小模组）

```java
public class ExampleMod implements ModInitializer {
    private static final String MOD_ID = "examplemod";

    // 静态初始化注册表
    // ⚠️ 1.17.x：直接返回注册后的对象，不使用 RegistrySupplier
    private static final Block MY_BLOCK =
        Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"),
            new Block(FabricBlockSettings.copyOf(Blocks.STONE).strength(1.5f)));

    private static final Item MY_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings()));

    // BlockItem 与方块同名注册
    private static final Item MY_BLOCK_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),
            new BlockItem(MY_BLOCK, new Item.Settings()));

    @Override
    public void onInitialize() {
        LOGGER.info("ExampleMod initialized — " + MY_ITEM.getItem().getTranslationKey());
    }
}
```

### 方式二：分散到多个注册类（推荐，适合中大型模组）

```java
// com/example/examplemod/registry/ModItems.java
public class ModItems {
    private ModItems() {}  // 工具类，禁止实例化

    private static final String MOD_ID = "examplemod";

    public static final Item MY_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings()));

    public static final Item MY_BLOCK_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),
            new BlockItem(ModBlocks.MY_BLOCK, new Item.Settings()));

    public static void initialize() {
        // 可在此添加初始化逻辑（如注册到 Tag）
    }
}
```

```java
// com/example/examplemod/ExampleMod.java
public class ExampleMod implements ModInitializer {
    @Override
    public void onInitialize() {
        ModItems.initialize();
        ModBlocks.initialize();
    }
}
```

> **注意**：
> - `Registry.register()` 在类加载时即完成注册，无需额外调用
> - ⚠️ **1.17.x 没有 RegistrySupplier**！直接用静态字段持有注册后的对象
> - `BlockItem` 与方块使用相同 registry name，Minecraft 自动关联

---

## 直接返回 vs RegistrySupplier

```java
// ✅ 推荐：直接返回注册后的对象（1.17.x 唯一正确方式）
private static final Block MY_BLOCK =
    Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"), new Block(...));

// ❌ 禁止：1.17.x 没有 RegistrySupplier！
private static final RegistrySupplier<Block> MY_BLOCK = ...  // 编译错误！

// ❌ 禁止：直接 public static final Item（不会被注册系统管理）
public static final Item MY_ITEM = new Item(...);  // 不会被注册
```

