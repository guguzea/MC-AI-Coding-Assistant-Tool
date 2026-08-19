# 注册模式

## 方块注册

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class ModBlocks {

    @SubscribeEvent
    public static void registerBlocks(RegistryEvent.Register<Block> event) {
        event.getRegistry().registerAll(
            RegistryHandler.BLOCK_SIMPLE.setRegistryName(ExampleMod.MOD_ID, "block_simple"),
            RegistryHandler.BLOCK_COMPLEX.setRegistryName(ExampleMod.MOD_ID, "block_complex")
        );
    }

    @SubscribeEvent
    public static void registerItems(RegistryEvent.Register<Item> event) {
        event.getRegistry().registerAll(
            new ItemBlock(RegistryHandler.BLOCK_SIMPLE)
                .setRegistryName(ExampleMod.MOD_ID, "block_simple"),
            new ItemBlock(RegistryHandler.BLOCK_COMPLEX)
                .setRegistryName(ExampleMod.MOD_ID, "block_complex")
        );
    }
}
```

## TileEntity 注册

官方 Registries 页列出的 RegistryEvent 类型不含 TileEntity。

```java
GameRegistry.registerTileEntity(MyTileEntity.class, new ResourceLocation(ExampleMod.MOD_ID, "my_tile"));
```

## 实体注册

```java
@Mod.EventBusSubscriber(modid = ExampleMod.MOD_ID)
public class ModEntities {

    @SubscribeEvent
    public static void register(RegistryEvent.Register<EntityEntry> event) {
        event.getRegistry().register(
            EntityEntryBuilder.create()
                .entity(MyEntity.class)
                .id(new ResourceLocation(ExampleMod.MOD_ID, "my_entity"), 0)
                .name("my_entity")
                .tracker(64, 3, true)
                .build()
        );
    }
}
```

## SoundEvent 注册

```java
public class ModSounds {
    public static final SoundEvent MY_SOUND = new SoundEvent(
        new ResourceLocation(ExampleMod.MOD_ID, "my_sound")
    ).setRegistryName(ExampleMod.MOD_ID, "my_sound");

    @SubscribeEvent
    public static void register(RegistryEvent.Register<SoundEvent> event) {
        event.getRegistry().register(MY_SOUND);
    }
}
```
