---
title: "GameRegistry"
description: "ItemStackHolder can be used to automatically populate public static final fields with ItemStack instances, referring a specific item, potentially configured with NBT."
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/registry/GameRegistry.html"
sourceType: javadoc
---

# GameRegistry

## Class signature

```java
public class GameRegistry extends java.lang.Object
```

## Constructors

- `public GameRegistry()`

## Methods

- `public static void registerWorldGenerator( IWorldGenerator generator, int modGenerationWeight)`
- `public static void registerEntitySelector( IEntitySelectorFactory factory, java.lang.String... arguments)`
- `public static java.util.List<<any>> createEntitySelectors(java.util.Map<java.lang.String,java.lang.String> arguments, java.lang.String mainSelector, ICommandSender sender, Vec3d position)`
- `public static void generateWorld(int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider)`
- `public static <K extends IForgeRegistryEntry <K>> IForgeRegistry <K> findRegistry(java.lang.Class<K> registryType)`
- `public static void addShapedRecipe( ResourceLocation name, ResourceLocation group, ItemStack output, java.lang.Object... params)`
- `public static void addShapelessRecipe( ResourceLocation name, ResourceLocation group, ItemStack output, Ingredient ... params)`
- `public static void addSmelting( Block input, ItemStack output, float xp)`
- `public static void addSmelting( Item input, ItemStack output, float xp)`
- `public static void addSmelting( ItemStack input, ItemStack output, float xp)`
- `@Deprecated public static void registerTileEntity(java.lang.Class<? extends TileEntity > tileEntityClass, java.lang.String key)`
- `public static void registerTileEntity(java.lang.Class<? extends TileEntity > tileEntityClass, ResourceLocation key)`
- `@Deprecated public static void registerFuelHandler( IFuelHandler handler)`
- `@Deprecated public static int getFuelValue( ItemStack itemStack)`
- `@Deprecated public static int getFuelValueLegacy( ItemStack itemStack)`
- `public static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)`

## Description

ItemStackHolder can be used to automatically populate public static final fields with ItemStack instances, referring a specific item, potentially configured with NBT.
