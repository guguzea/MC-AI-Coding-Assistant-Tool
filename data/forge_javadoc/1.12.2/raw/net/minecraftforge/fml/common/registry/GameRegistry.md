---
title: "GameRegistry"
description: "public class GameRegistry extends java.lang.Object"
package: "net/minecraftforge/fml/common/registry"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/registry/GameRegistry.html"
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

- `static void addShapedRecipe(ResourceLocation name, ResourceLocation group, ItemStack output, java.lang.Object... params)`
- `static void addShapelessRecipe(ResourceLocation name, ResourceLocation group, ItemStack output, Ingredient ... params)`
- `static void addSmelting(Block input, ItemStack output, float xp)`
- `static void addSmelting(Item input, ItemStack output, float xp)`
- `static void addSmelting(ItemStack input, ItemStack output, float xp)`
- `static java.util.List<<any>> createEntitySelectors(java.util.Map<java.lang.String, java.lang.String> arguments, java.lang.String mainSelector, ICommandSender sender, Vec3d position)` — Creates a list of entity selectors using the registered factories.
- `static<K extends IForgeRegistryEntry<K>> IForgeRegistry<K> findRegistry(java.lang.Class<K> registryType)` — Retrieves the registry associated with this super class type.
- `static void generateWorld(int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider)` — Callback hook for world gen - if your mod wishes to add extra mod related generation to the world call this
- `@Deprecated static int getFuelValue(ItemStack itemStack)` — Deprecated. use ForgeEventFactory.getItemBurnTime(ItemStack)
- `@Deprecated static int getFuelValueLegacy(ItemStack itemStack)` — Deprecated. use ForgeEventFactory.getItemBurnTime(ItemStack)
- `static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)` — Makes an ItemStack based on the itemName reference, with supplied meta, stackSize and nbt, if possible Will return null if the item doesn't exist (because it's not from a loaded mod for example) Will throw a RuntimeException if the nbtString is invalid for use in an ItemStack
- `static void registerEntitySelector(IEntitySelectorFactory factory, java.lang.String... arguments)` — Registers a entity selector factory which is used to create predicates whenever a command containing selectors is executed Any non vanilla arguments that you expect has to be registered.
- `@Deprecated static void registerFuelHandler(IFuelHandler handler)` — Deprecated. set your item's Item.getItemBurnTime(ItemStack) or subscribe to FurnaceFuelBurnTimeEvent instead.
- `static void registerTileEntity(java.lang.Class<? extends TileEntity> tileEntityClass, ResourceLocation key)`
- `@Deprecated static void registerTileEntity(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String key)`
- `static void registerWorldGenerator(IWorldGenerator generator, int modGenerationWeight)` — Register a world generator - something that inserts new block types into the world
