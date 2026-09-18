---
title: "GameRegistry"
description: "This will cause runtime injection of public static final fields to occur at various points where mod blocks and items could be subject to change."
package: "cpw/mods/fml/common/registry"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/registry/GameRegistry.html"
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
- `public static void generateWorld(int chunkX, int chunkZ, World world, IChunkProvider chunkGenerator, IChunkProvider chunkProvider)`
- `public static void registerItem( Item item, java.lang.String name)`
- `public static Item registerItem( Item item, java.lang.String name, java.lang.String modId)`
- `public static void addSubstitutionAlias(java.lang.String nameToSubstitute, GameRegistry.Type type, java.lang.Object object) throws ExistingSubstitutionException`
- `public static Block registerBlock( Block block, java.lang.String name)`
- `public static Block registerBlock( Block block, java.lang.Class<? extends ItemBlock > itemclass, java.lang.String name)`
- `@Deprecated public static Block registerBlock( Block block, java.lang.Class<? extends ItemBlock > itemclass, java.lang.String name, java.lang.String modId, java.lang.Object... itemCtorArgs)`
- `public static Block registerBlock( Block block, java.lang.Class<? extends ItemBlock > itemclass, java.lang.String name, java.lang.Object... itemCtorArgs)`
- `public static void addRecipe( ItemStack output, java.lang.Object... params)`
- `public static IRecipe addShapedRecipe( ItemStack output, java.lang.Object... params)`
- `public static void addShapelessRecipe( ItemStack output, java.lang.Object... params)`
- `public static void addRecipe( IRecipe recipe)`
- `public static void addSmelting( Block input, ItemStack output, float xp)`
- `public static void addSmelting( Item input, ItemStack output, float xp)`
- `public static void addSmelting( ItemStack input, ItemStack output, float xp)`
- `public static void registerTileEntity(java.lang.Class<? extends TileEntity > tileEntityClass, java.lang.String id)`
- `public static void registerTileEntityWithAlternatives(java.lang.Class<? extends TileEntity > tileEntityClass, java.lang.String id, java.lang.String... alternatives)`
- `public static void registerFuelHandler( IFuelHandler handler)`
- `public static int getFuelValue( ItemStack itemStack)`
- `public static Block findBlock(java.lang.String modId, java.lang.String name)`
- `public static Item findItem(java.lang.String modId, java.lang.String name)`
- `public static void registerCustomItemStack(java.lang.String name, ItemStack itemStack)`
- `public static ItemStack findItemStack(java.lang.String modId, java.lang.String name, int stackSize)`
- `public static GameRegistry.UniqueIdentifier findUniqueIdentifierFor( Block block)`
- `public static GameRegistry.UniqueIdentifier findUniqueIdentifierFor( Item item)`
- `public static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)`

## Description

This will cause runtime injection of public static final fields to occur at various points where mod blocks and items could be subject to change.
