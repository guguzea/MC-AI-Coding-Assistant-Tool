# Minecraft Mod 跨平台/跨版本移植指南

## 决策入口（Decision Flow）

```
用户要"跨版本"（同 Loader 内升级/降级）
  → 1.12.x → 1.18.x：Registry API 重大断裂（RegistryEvent → DeferredRegister）
  → 1.18.x → 1.20.x：API 基本一致（DeferredRegister）

用户要"跨平台"（Forge → NeoForge）
  → 1.20.1 Forge → NeoForge 1.20.2：包名从 net.minecraftforge → net.neoforged

用户要"从 1.12.x 迁移到 1.18+"
  → RegistryEvent → DeferredRegister
  → TileEntity → BlockEntity
  → NBTTagCompound → CompoundTag
  → Java 8 → Java 17
  → Gradle 4.9 → Gradle 8.x
```

---

## 1.12.x → 1.18.x 迁移 Checklist

### Registry 迁移

```java
// 1.12.x
@Mod.EventBusSubscriber(modid = MOD_ID)
public class ModBlocks {
    @SubscribeEvent
    public static void register(RegistryEvent.Register<Block> event) {
        event.getRegistry().register(
            new Block(Material.ROCK)
                .setRegistryName(MOD_ID, "my_block")
        );
    }
}

// 1.18.x+
public static final DeferredRegister<Block> BLOCKS =
    DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

public static final RegistryObject<Block> MY_BLOCK = BLOCKS.register("my_block",
    () -> new Block(Block.Properties.of(Material.STONE))
);
```

### Java 版本

- 1.12.x：Java 8
- 1.18.x：Java 17

### pack_format

- 1.12.x 无 1.13 式数据包；资源包 pack_format = **3**（`pack.mcmeta` 键为 `description`）
- 1.18.x 数据包 = **9**

---

## 引用链接

| 场景 | 参考来源 |
|------|---------|
| Forge 1.12.2 官方文档 | https://docs.minecraftforge.net/en/1.12.2/ |
| Forge 1.18.x 官方文档 | https://docs.minecraftforge.net/en/1.18.2/ |
| 版本迁移指南 | https://github.com/MinecraftForge/MinecraftForge/wiki/Version-1.18.x-Migration |
