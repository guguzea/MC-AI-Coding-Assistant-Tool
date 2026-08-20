# 跨 Loader API 对照表

> 按功能域分类，对比 Forge 1.12.2 / Forge 1.18+ / Fabric 的 API 差异。

| 功能域 | Forge 1.12.2 | Forge 1.18+ | Fabric |
|--------|---------------|------------|--------|
| **注册方块** | RegistryEvent.Register<Block> | DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID) | Registry.register(Registries.BLOCK, id, block) |
| **注册物品** | RegistryEvent.Register<Item> | DeferredRegister.create(ForgeRegistries.ITEMS, MOD_ID) | Registry.register(Registries.ITEM, id, item) |
| **注册 TileEntity** | TileEntity.register() | DeferredRegister.create(ForgeRegistries.BLOCK_ENTITY_TYPES, MOD_ID) | BlockEntityType.Builder.create() |
| **网络通信** | SimpleNetworkWrapper | SimpleChannel | ClientPlayNetworking |
| **事件订阅** | @EventBusSubscriber + @SubscribeEvent | modEventBus.addListener() | @SubscribeEvent |
| **物理端检测** | @SideOnly(Side.CLIENT) | @OnlyIn(Dist.CLIENT) | @Environment(EnvType.CLIENT) |
| **NBT** | NBTTagCompound | CompoundTag | NbtCompound |
| **方块实体** | TileEntity | BlockEntity | BlockEntity |
| **资源格式** | 资源包 format=3（无数据包） | 数据包 9+ | 数据包 9+ |
| **Java 版本** | Java 8 | Java 17+ | Java 17+ |
| **Gradle** | 4.9 + FG 2.3 | 8.x + FG 6.x | 8.x + Loom |

---

## 注意事项

- **Forge 1.12.2 是最后一个支持 Java 8 的版本**
- DeferredRegister 在 Forge 1.12.2 中不存在
- 1.12 无数据包；1.13 起才有数据包 format（1.13 = 4）
