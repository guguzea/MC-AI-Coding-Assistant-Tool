# GameData

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.GameData

## Class signature

```java
public class GameData extends java.lang.Object
```

## Constructors

- `GameData()`

## Methods

- `@Deprecated static FMLControlledNamespacedRegistry<Biome> getBiomeRegistry()`
- `static com.google.common.collect.BiMap<Block, Item> getBlockItemMap()`
- `@Deprecated static FMLControlledNamespacedRegistry<Block> getBlockRegistry()`
- `static ObjectIntIdentityMap<IBlockState> getBlockStateIDMap()`
- `@Deprecated static FMLControlledNamespacedRegistry<Enchantment> getEnchantmentRegistry()`
- `@Deprecated static FMLControlledNamespacedRegistry<EntityEntry> getEntityRegistry()`
- `@Deprecated static FMLControlledNamespacedRegistry<Item> getItemRegistry()`
- `protected static GameData getMain()`
- `@Deprecated static FMLControlledNamespacedRegistry<Potion> getPotionRegistry()`
- `@Deprecated static FMLControlledNamespacedRegistry<PotionType> getPotionTypesRegistry()`
- `@Deprecated static FMLControlledNamespacedRegistry<SoundEvent> getSoundEventRegistry()`
- `@Deprecated static LegacyNamespacedRegistry<java.lang.Class<? extends TileEntity>> getTileEntityRegistry()`
- `<T extends IForgeRegistryEntry<T>> RegistryDelegate<T> makeDelegate(T obj, java.lang.Class<T> rootClass)`
- `static void vanillaSnapshot()`