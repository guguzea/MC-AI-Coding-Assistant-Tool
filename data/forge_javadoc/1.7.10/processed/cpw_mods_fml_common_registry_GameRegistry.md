# GameRegistry

**Inheritance:** java.lang.Object → cpw.mods.fml.common.registry.GameRegistry

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
- `static ItemStack findItemStack(java.lang.String modId, java.lang.String name, int stackSize)` — Lookup an itemstack based on mod and name.
- `static GameRegistry.UniqueIdentifier findUniqueIdentifierFor(Block block)` — Look up the mod identifier data for a block.
- `static GameRegistry.UniqueIdentifier findUniqueIdentifierFor(Item item)` — Look up the mod identifier data for an item.
- `static void generateWorld(int chunkX, int chunkZ, World world, IChunkProvider chunkGenerator, IChunkProvider chunkProvider)` — Callback hook for world gen - if your mod wishes to add extra mod related generation to the world call this
- `static int getFuelValue(ItemStack itemStack)`
- `static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)` — Makes an ItemStack based on the itemName reference, with supplied meta, stackSize and nbt, if possible Will return null if the item doesn't exist (because it's not from a loaded mod for example) Will throw a RuntimeException if the nbtString is invalid for use in an ItemStack
- `static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name)` — Register a block with the world, with the specified item class and block name
- `static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name, java.lang.Object... itemCtorArgs)` — Register a block with the world, with the specified item class, block name and owning modId
- `@Deprecated static Block registerBlock(Block block, java.lang.Class<? extends ItemBlock> itemclass, java.lang.String name, java.lang.String modId, java.lang.Object... itemCtorArgs)` — Deprecated. Use the registerBlock version without the modId parameter instead.
- `static Block registerBlock(Block block, java.lang.String name)` — Register a block with the specified mod specific name
- `static void registerCustomItemStack(java.lang.String name, ItemStack itemStack)` — Manually register a custom item stack with FML for later tracking.
- `static void registerFuelHandler(IFuelHandler handler)`
- `static void registerItem(Item item, java.lang.String name)` — Register an item with the item registry with a custom name : this allows for easier server->client resolution
- `static Item registerItem(Item item, java.lang.String name, java.lang.String modId)` — Register the specified Item with a mod specific name : overrides the standard type based name
- `static void registerTileEntity(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id)`
- `static void registerTileEntityWithAlternatives(java.lang.Class<? extends TileEntity> tileEntityClass, java.lang.String id, java.lang.String... alternatives)` — Register a tile entity, with alternative TileEntity identifiers.
- `static void registerWorldGenerator(IWorldGenerator generator, int modGenerationWeight)` — Register a world generator - something that inserts new block types into the world