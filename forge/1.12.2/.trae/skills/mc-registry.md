---
name: mc-registry
description: Minecraft Forge 注册系统。注册方块、物品、实体、方块实体等。触发词：注册、register、RegistryEvent、@EventBusSubscriber、ForgeRegistries、@Mod
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# Registry 注册系统（Forge 1.12.2）

## 快速开始

**Forge 1.12.2 必须使用 `@EventBusSubscriber` + `RegistryEvent`：**

```java
// 1. 创建 @EventBusSubscriber 类
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModRegistry {
    // 2. 使用 @SubscribeEvent 监听 RegistryEvent
    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new Block(Material.ROCK)
                .setRegistryName(MOD_ID, "my_block")
        );
    }
}
```

## Decision: 选择注册方式

```
IF 注册方块/物品/实体/TileEntity 等
  → 使用 @EventBusSubscriber + RegistryEvent.Register<T>

IF 平台 = Forge 1.18+
  → 使用 DeferredRegister（1.12.2 没有 DeferredRegister）

IF 平台 = Fabric
  → 使用 Registry.register() in onInitialize
```

## Decision: 常用注册表

| 注册内容 | 事件类型 | 备注 |
|----------|----------|------|
| 方块 | `RegistryEvent.Register<Block>` | |
| 物品 | `RegistryEvent.Register<Item>` | |
| 方块实体 | `RegistryEvent.Register<TileEntity>` | 用 TileEntity.register() |
| 实体类型 | `RegistryEvent.Register<EntityEntry>` | 用 EntityRegistry |
| 附魔 | `RegistryEvent.Register<Enchantment>` | |
| 声音事件 | `RegistryEvent.Register<SoundEvent>` | |

## 注册 TileEntity

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModTileEntities {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<TileEntity> event) {
        TileEntity.register(MOD_ID + ":my_tile", MyTileEntity.class);
    }
}
```

## 常见错误

- ❌ 使用 `DeferredRegister`（Forge 1.12.2 没有）
- ❌ 忘记 `@EventBusSubscriber` 注解
- ❌ 忘记 `@SubscribeEvent` 注解
- ❌ Registry 名称含大写或横杠

## 参考资料

- Forge 官方文档：https://docs.minecraftforge.net/en/1.12.2/
- 详细示例：参见 `01-registry.mdc`

## 扩展点

| 配合 Skill | 协作说明 |
|------------|---------|
| `mc-block` | 方块注册后方块实体注册需要先有方块 |
| `mc-item` | 物品注册后方块物品（ItemBlock）需要先有方块 |
| `mc-entity` | 实体注册后方块实体类型引用实体类型 |
