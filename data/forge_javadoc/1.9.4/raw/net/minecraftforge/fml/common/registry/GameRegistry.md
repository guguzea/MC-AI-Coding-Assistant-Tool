---
title: "GameRegistry"
description: "public class GameRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/registry/GameRegistry.html"
sourceType: javadoc
---

# GameRegistry

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.GameRegistry

## Class signature

```java
public class GameRegistry extends java.lang.Object
```

## Constructors

- `GameRegistry()`

## Methods

- `static void addRecipe(IRecipe recipe)`
- `static void addRecipe(ItemStack output, java.lang.Object... params)`
- `static IRecipe addShapedRecipe(ItemStack output, java.lang.Object... params)`
- `static void addShapelessRecipe(ItemStack output, java.lang.Object... params)`
- `static void addSmelting(Block input, ItemStack output, float xp)`
- `static void addSmelting(Item input, ItemStack output, float xp)`
- `static void addSmelting(ItemStack input, ItemStack output, float xp)`
- `static void addSubstitutionAlias(java.lang.String nameToSubstitute, GameRegistry.Type type, java.lang.Object object)` — Add a forced persistent substitution alias for the block or item to another block or item.
- `@Deprecated static Block findBlock(java.lang.String modId, java.lang.String name)`
- `@Deprecated static Item findItem(java.lang.String modId, java.lang.String name)`
- `static<K extends IForgeRegistryEntry<K>> IForgeRegistry<K> findRegistry(java.lang.Class<K> registryType)` — Retrieves the registry associated with this super class type.
- `static void generateWorld(int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider)` — Callback hook for world gen - if your mod wishes to add extra mod related generation to the world call this
- `static int getFuelValue(ItemStack itemStack)`
- `static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)` — Makes an ItemStack based on the itemName reference, with supplied meta, stackSize and nbt, if possible Will return null if the item doesn't exist (because it's not from a loaded mod for example) Will throw a RuntimeException if the nbtString is invalid for use in an ItemStack
- `static<K extends IForgeRegistryEntry<?>> K register(K object)` — Register the previously named IForgeRegistry object with the registry system.
- `static<K extends IForgeRegistryEntry<?>> K register(K object, ResourceLocation name)` — Register the unnamed IForgeRegistry object with the registry system.
- `@Deprecated static Block registerBlock(Block block)`
- `@Deprecated static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass)`
- `@Deprecated static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.Object... itemCtorArgs)`
- `@Deprecated static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name)`
- `@Deprecated static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name, java.lang.Object... itemCtorArgs)`
- `@Deprecated static Block registerBlock(Block block, java.lang.String name)`
- `static void registerFuelHandler(IFuelHandler handler)`
- `@Deprecated static void registerItem(Item item)`
- `@Deprecated static void registerItem(Item item, java.lang.String name)`
- `static void registerTileEntity(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id)`
- `static void registerTileEntityWithAlternatives(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id, java.lang.String... alternatives)` — Register a tile entity, with alternative TileEntity identifiers.
- `@Deprecated static Block registerWithItem(Block block)`
- `static void registerWorldGenerator(IWorldGenerator generator, int modGenerationWeight)` — Register a world generator - something that inserts new block types into the world
