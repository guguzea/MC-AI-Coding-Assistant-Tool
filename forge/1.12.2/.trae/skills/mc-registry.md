---
name: mc-registry
description: Forge 1.12.2 Registry skill (RegistryEvent, @EventBusSubscriber, no DeferredRegister)
platform: forge
version: "1.12.2"
dependencies: []
mappings: mcp
---

# Registry 注册系统（Forge 1.12.2）

## 快速开始

**Forge 1.12.2 必须使用 `@EventBusSubscriber` + `RegistryEvent`：**

```java
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModRegistry {
    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new Block(Block.Properties.create(Material.ROCK))
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

## Key Forge 1.12.2 Specs

- RegistryEvent.Register<T> instead of DeferredRegister
- @EventBusSubscriber + @SubscribeEvent
- NBTTagCompound (not CompoundTag)
- @SideOnly(Side.CLIENT) (not @OnlyIn(Dist.CLIENT))
- world.isRemote (not level.isClientSide)
- pack_format = 4
- No DataGen API
- SimpleNetworkWrapper (not SimpleChannel)
- IGuiHandler (not MenuType)
- FMLInitializationEvent (not modEventBus)
- IBlockState (not BlockState)
- TileEntity (not BlockEntity)
- IItemTier (not Tier)
