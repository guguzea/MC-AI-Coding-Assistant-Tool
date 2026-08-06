---
name: mc-registry
description: Fabric 注册系统。Registry.register、Identifier、onInitialize。触发词：注册、Registry、Identifier、onInitialize、fabric.mod.json
platform: fabric
version: "1.17.1"
dependencies: []
mappings: yarn
---

# 注册系统（Fabric 1.17.1）

## 快速开始

```java
public class ExampleMod implements ModInitializer {
    private static final String MOD_ID = "examplemod";

    // Registry.register 在类加载时执行
    // ⚠️ 1.17.x 使用 Registry.ITEM 静态字段，不是 Registries.ITEM
    private static final Item MY_ITEM =
        Registry.register(Registry.ITEM,
            new Identifier(MOD_ID, "my_item"),
            new Item(new Item.Settings())
        );

    @Override
    public void onInitialize() {
        // 注册完成，所有内容已可用
    }
}
```

## Decision: 选择注册方式

```
IF 注册 方块/物品/实体/方块实体/粒子/声音
  → Registry.register(Registry.XXX, id, object)
  → ⚠️ 1.17.x 使用 Registry.ITEM / Registry.BLOCK 等静态字段，不是 Registries.ITEM / Registries.BLOCK

IF 注册 Mixin
  → 在 fabric.mixins.json 中声明，不在 onInitialize 中

IF 注册 客户端专用组件（渲染器/快捷键）
  → 在 ClientModInitializer 中处理

IF 平台 = Forge
  → 跳转 forge/1.17.1/.cursor/rules/01-registry.mdc
```

## Registry 类型

> ⚠️ **1.17.x 重要区别**：1.17.x 没有 `Registries` 类！使用 `Registry.ITEM`、`Registry.BLOCK` 等**静态字段**。

| 注册内容 | Registry 静态字段 | 必需参数 |
|---------|-----------------|---------|
| 方块 | `Registry.BLOCK` | `Identifier`, `Block` |
| 物品 | `Registry.ITEM` | `Identifier`, `Item` |
| 方块实体类型 | `Registry.BLOCK_ENTITY_TYPE` | `Identifier`, `BlockEntityType` |
| 实体类型 | `Registry.ENTITY_TYPE` | `Identifier`, `EntityType` |
| 粒子类型 | `Registry.PARTICLE_TYPE` | `Identifier`, `ParticleType` |
| 声音事件 | `Registry.SOUND_EVENT` | `Identifier`, `SoundEvent` |
| 菜单类型 | `Registry.SCREEN_HANDLER` | `Identifier`, `ScreenHandlerType` |
| 附魔 | `Registry.ENCHANTMENT` | `Identifier`, `Enchantment` |
| 流体 | `Registry.FLUID` | `Identifier`, `Fluid` |

## 直接注册用法

```java
// ✅ 1.17.x 正确方式：直接用静态字段持有注册后的对象
private static final Item MY_ITEM =
    Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_item"),
        new Item(new Item.Settings()));

// ❌ 禁止：1.17.x 没有 RegistrySupplier！
private static final RegistrySupplier<Item> MY_ITEM = ...  // 编译错误！
```

## BlockItem 注册

```java
// ✅ 正确：BlockItem 与 Block 使用完全相同的 Identifier
private static final Block MY_BLOCK =
    Registry.register(Registry.BLOCK, new Identifier(MOD_ID, "my_block"),
        new Block(FabricBlockSettings.copyOf(Blocks.STONE)));

private static final Item MY_BLOCK_ITEM =
    Registry.register(Registry.ITEM, new Identifier(MOD_ID, "my_block"),  // 同名！
        new BlockItem(MY_BLOCK, new Item.Settings()));
```

## Identifier 构造

```java
// ✅ 正确
new Identifier("fabric", "diamond");          // fabric:diamond
new Identifier(MOD_ID, "my_item");           // examplemod:my_item

// ❌ 错误：不要直接写字符串
new Identifier("examplemod:my_item");         // 这会被当作完整 ID 而非 namespace:id
```

## 常见错误

- ❌忘记在 `onInitialize()` 中等待注册完成 — 静态初始化在类加载时执行，已在 `onInitialize` 之前
- ❌ BlockItem 与 Block 使用不同 registry name — 物品形态缺失
- ❌在 `onInitialize()` 外注册 — 注册可能不会生效
- ❌忘记在 `fabric.mod.json` 中注册 `entrypoints` — mod 入口不会被调用
- ❌ 使用 `Registries.ITEM` — 1.17.x 应使用 `Registry.ITEM`

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-block` | 方块通过 Registry.register() 注册 |
| `mc-item` | 物品通过 Registry.register() 注册 |
| `mc-mixin` | Mixin 通过 fabric.mixins.json 声明，无需注册 |
