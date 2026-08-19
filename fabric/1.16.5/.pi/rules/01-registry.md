---
description: 01 — 注册系统
---

# 01 — 注册系统

> 适用版本：Fabric 1.16.5
> **本文件最重要，所有注册相关操作必须先读本文件。**

---

## 约束

### 核心原则

- 必须 `Registry.register`；只 `new` 不注册的对象不会出现在游戏中
- **所有注册**必须在 `onInitialize()` 方法（或 entrypoint）中通过 `Registry.register()` 执行
- Fabric **没有** modEventBus，所有注册直接调用 `Registry`
- mod ID 必须与 `fabric.mod.json` 中的 `id` 完全一致
- 使用 `Identifier` 构造：`new Identifier(MOD_ID, "registry_name")`

### Registry API（1.16.5）

Yarn 1.16.5 用 **`Registry` 静态字段**（[`Registry.mapping`](https://github.com/FabricMC/yarn/blob/1.16.5/mappings/net/minecraft/util/registry/Registry.mapping)）：`ITEM` / `BLOCK` / `BLOCK_ENTITY_TYPE` / `SCREEN_HANDLER`。**没有** 1.19.3+ 的 `Registries` 类。

```java
// ✅ 正确
Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"), myItem);

// ❌ 错误：Registries 是 1.19.3+
Registry.register(Registries.ITEM, new Identifier(MOD_ID, "my_item"), myItem);
```

### 注册时机

| 注册内容 | API | 代码位置 |
|---------|-----|---------|
| 方块 | `Registry.register(Registry.BLOCK, id, block)` | `onInitialize()` |
| 物品 | `Registry.register(Registry.ITEM, id, item)` | `onInitialize()` |
| 方块实体 | `Registry.register(Registry.BLOCK_ENTITY_TYPE, id, type)` | `onInitialize()` |
| 实体类型 | `Registry.register(Registry.ENTITY_TYPE, id, type)` | `onInitialize()` |
| 粒子类型 | `Registry.register(Registry.PARTICLE_TYPE, id, type)` | `onInitialize()` |
| 声音事件 | `Registry.register(Registry.SOUND_EVENT, id, soundEvent)` | `onInitialize()` |

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
IF 注册 方块 / 物品 / 实体 / 方块实体 / 粒子 / 声音等标准内容
  → 使用 Registry.register() 在 onInitialize() 中执行

IF 注册 方块实体类型
  → Registry.register(Registry.BLOCK_ENTITY_TYPE, id, BlockEntityType)
  → 方块的 blockEntityType 属性指向该 BlockEntityType

IF 注册 Mixin
  → 在 fabric.mixins.json 中声明，不需要在 onInitialize() 中注册

IF 平台 = Forge
  → 跳转 ../forge/1.16.5/AGENTS.md（Forge 使用 DeferredRegister）
```

### Decision: 注册顺序（依赖关系）

```
IF 一个方块有对应的 ItemBlock
  → 必须先注册 Block，再注册 ItemBlock
  → ItemBlock 的 registry name 必须与 Block 完全相同

IF 一个方块有 BlockEntity
  → 必须先注册 Block，再注册 BlockEntityType
  → 方块的 BlockEntityProvider 接口提供 BlockEntity 实例
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
            new Block(FabricBlockSettings.copy(Blocks.STONE).hardness(1.5f)));

    // BlockItem 与方块同名注册
    private static final Item MY_BLOCK_ITEM =
        Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),
            new BlockItem(MY_BLOCK, new Item.Settings()));

    @Override
    public void onInitialize() {
        LOGGER.info("ExampleMod initialized — " + Registry.ITEM.getId(MY_ITEM));
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
> - `Registry.register` 返回已注册对象；不要用 Architectury 的 `RegistrySupplier`
> - `BlockItem` 与方块使用相同 registry name，Minecraft 自动关联

---

## 注册返回值

```java
// ✅ 推荐：保存 Registry.register 的返回值
private static final Item MY_ITEM =
    Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"), new Item(...));

// ✅ 可行：直接静态字段（无懒加载）
private static final Item MY_ITEM = Registry.register(Registry.ITEM,
    new Identifier(MOD_ID, "my_item"), new Item(...));

// ❌ 禁止：直接 public static final Item（不会被注册系统管理）
public static final Item MY_ITEM = new Item(...);  // 不会被注册
```
