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
- `static Block findBlock(java.lang.String modId, java.lang.String name)` — Look up a mod block in the global "named item list"
- `static Item findItem(java.lang.String modId, java.lang.String name)` — Look up a mod item in the global "named item list"
- `@Deprecated static GameRegistry.UniqueIdentifier findUniqueIdentifierFor(Block block)`
- `@Deprecated static GameRegistry.UniqueIdentifier findUniqueIdentifierFor(Item item)`
- `static void generateWorld(int chunkX, int chunkZ, World world, IChunkProvider chunkGenerator, IChunkProvider chunkProvider)` — Callback hook for world gen - if your mod wishes to add extra mod related generation to the world call this
- `static int getFuelValue(ItemStack itemStack)`
- `static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)` — Makes an ItemStack based on the itemName reference, with supplied meta, stackSize and nbt, if possible Will return null if the item doesn't exist (because it's not from a loaded mod for example) Will throw a RuntimeException if the nbtString is invalid for use in an ItemStack
- `static Block registerBlock(Block block)` — Register a block with the name that Block.getRegistryName returns.
- `static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass)` — Register a block with the world, with the specified item class using Block.getRegistryName's name
- `static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.Object... itemCtorArgs)` — Register a block with the world, with the specified item class using Block.getRegistryName's name
- `static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name)` — Register a block with the world, with the specified item class and block name
- `static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name, java.lang.Object... itemCtorArgs)` — Register a block with the world, with the specified item class, block name and owning modId
- `static Block registerBlock(Block block, java.lang.String name)` — Register a block with the specified mod specific name
- `static void registerFuelHandler(IFuelHandler handler)`
- `static void registerItem(Item item)` — Register an item with the item registry with a the name specified in Item.getRegistryName()
- `static void registerItem(Item item, java.lang.String name)` — Register an item with the item registry with a custom name : this allows for easier server->client resolution
- `@Deprecated static Item registerItem(Item item, java.lang.String name, java.lang.String modId)`
- `static void registerTileEntity(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id)`
- `static void registerTileEntityWithAlternatives(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id, java.lang.String... alternatives)` — Register a tile entity, with alternative TileEntity identifiers.
- `static void registerWorldGenerator(IWorldGenerator generator, int modGenerationWeight)` — Register a world generator - something that inserts new block types into the world