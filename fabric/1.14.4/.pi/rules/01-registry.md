---
description: 01 — 注册系统
---

# 01 — 注册系统

> 适用版本：Fabric 1.14.4
> **本文件最重要，所有注册相关操作必须先读本文件。**

---

## 约束

### 核心原则

- 必须 `Registry.register`；只 `new` 不注册的对象不会出现在游戏中
- **所有注册**必须在 `onInitialize()` 方法（或 entrypoint）中通过 `Registry.register()` 执行
- Fabric **没有** modEventBus，所有注册直接调用 `Registry`
- mod ID 必须与 `fabric.mod.json` 中的 `id` 完全一致
- 使用 Yarn `Identifier`：`new Identifier(MOD_ID, "registry_name")`（不要写 MCP `ResourceLocation`）

### 注册时机

| 注册内容 | API | 代码位置 |
|---------|-----|---------|
| 方块 | `Registry.register(Registry.BLOCK, id, block)` | `onInitialize()` |
| 物品 | `Registry.register(Registry.ITEM, id, item)` | `onInitialize()` |
| 方块实体 | `Registry.register(Registry.BLOCK_ENTITY, id, type)` | `onInitialize()` |
| 实体类型 | `Registry.register(Registry.ENTITY_TYPE, id, type)` | `onInitialize()` |
| 粒子类型 | `Registry.register(Registry.PARTICLE_TYPE, id, type)` | `onInitialize()` |
| 声音事件 | `Registry.register(Registry.SOUND_EVENT, id, soundEvent)` | `onInitialize()` |
| 附魔 | `Registry.register(Registry.ENCHANTMENT, id, enchantment)` | `onInitialize()` |
| 流体 | `Registry.register(Registry.FLUID, id, fluid)` | `onInitialize()` |
| 容器类型 | `Registry.register(Registry.CONTAINER, id, type)` | `onInitialize()`（Yarn `ContainerType`，不是 `ScreenHandlerType`） |

### mod ID 规范

```java
// ✅ 正确：在 fabric.mod.json 中声明的 mod ID
private static final String MOD_ID = "examplemod";

// ❌ 错误：含大写，或与 fabric.mod.json 的 id 不一致
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

IF 注册 方块实体类型
  → Registry.register(Registry.BLOCK_ENTITY, id, BlockEntityType)
  → Yarn 字段名是 BLOCK_ENTITY，不是后期的 BLOCK_ENTITY_TYPE

IF 注册 Mixin
  → 在 fabric.mixins.json 中声明，不需要在 onInitialize() 中注册

IF 平台 = Forge
  → 跳转 ../forge/1.14.4/AGENTS.md（Forge 使用 DeferredRegister）
```

### Decision: 注册顺序（依赖关系）

```
IF 一个方块有对应的 BlockItem
  → 必须先注册 Block，再注册 BlockItem
  → BlockItem 的 registry name 必须与 Block 完全相同

IF 一个方块有 BlockEntity
  → 必须先注册 Block，再注册 BlockEntityType
  → 方块的 BlockEntityProvider 接口提供 BlockEntity 实例

IF 需要物品附加数据
  → 1.14 原版没有 Forge Capability / 后期 Cardinal Components；用 NBT 或第三方库，不要编造 Fabric Capability 注册 API
```

---

## 示例：完整注册流程

### 方式一：所有内容集中在 ExampleMod（适合小模组）

```java
public class ExampleMod implements ModInitializer {
    private static final String MOD_ID = "examplemod";

    // 静态初始化注册表
    private static final Item MY_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"), new Item(new Item.Settings()));

    private static final Block MY_BLOCK =
        Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"),
            new Block(Block.Settings.of(Material.STONE).strength(1.5f, 6.0f)));

    // BlockItem 与方块同名注册
    private static final Item MY_BLOCK_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),
            new BlockItem(MY_BLOCK, new Item.Settings()));

    @Override
    public void onInitialize() {
        // 所有注册在类加载时即完成
        System.out.println("ExampleMod initialized — " + Registry.ITEM.getId(MY_ITEM));
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

---

## Registry vs Registries（版本差异）

1.14.4 中使用 **`Registry`** 作为静态字段持有者（如 `Registry.ITEM`、`Registry.BLOCK`），不存在 `Registries` 类。

```java
// ✅ 正确（1.14.4）
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"), myItem);

// ❌ 错误（1.14.4 中 Registries 类不存在）
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), myItem);
```
