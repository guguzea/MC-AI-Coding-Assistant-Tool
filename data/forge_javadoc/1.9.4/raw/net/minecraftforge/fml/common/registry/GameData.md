---
title: "GameData"
description: "public class GameData extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/GameData.html"
sourceType: javadoc
---

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
- `@Deprecated static FMLControlledNamespacedRegistry<Item> getItemRegistry()`
- `protected static GameData getMain()`
- `@Deprecated static FMLControlledNamespacedRegistry<Potion> getPotionRegistry()`
- `@Deprecated static FMLControlledNamespacedRegistry<PotionType> getPotionTypesRegistry()`
- `@Deprecated static FMLControlledNamespacedRegistry<SoundEvent> getSoundEventRegistry()`
- `<T extends IForgeRegistryEntry<T>> RegistryDelegate<T> makeDelegate(T obj, java.lang.Class<T> rootClass)`
- `static void vanillaSnapshot()`
