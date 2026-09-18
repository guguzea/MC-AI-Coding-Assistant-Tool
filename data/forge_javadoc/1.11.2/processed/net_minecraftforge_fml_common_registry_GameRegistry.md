# GameRegistry

## Class signature

```java
public class GameRegistry extends java.lang.Object
```

## Constructors

- `public GameRegistry()`

## Methods

- `public static void registerWorldGenerator( IWorldGenerator generator, int modGenerationWeight)`
- `public static void generateWorld(int chunkX, int chunkZ, World world, IChunkGenerator chunkGenerator, IChunkProvider chunkProvider)`
- `public static <K extends IForgeRegistryEntry <?>> K register(K object)`
- `public static <K extends IForgeRegistryEntry <?>> K register(K object, ResourceLocation name)`
- `@Deprecated public static Block registerWithItem( Block block)`
- `public static <K extends IForgeRegistryEntry <K>> IForgeRegistry <K> findRegistry(java.lang.Class<K> registryType)`
- `public static void addSubstitutionAlias(java.lang.String nameToSubstitute, GameRegistry.Type type, java.lang.Object object) throws ExistingSubstitutionException`
- `public static void addRecipe(@Nonnull ItemStack output, java.lang.Object... params)`
- `public static IRecipe addShapedRecipe(@Nonnull ItemStack output, java.lang.Object... params)`
- `public static void addShapelessRecipe(@Nonnull ItemStack output, java.lang.Object... params)`
- `public static void addRecipe( IRecipe recipe)`
- `public static void addSmelting( Block input, @Nonnull ItemStack output, float xp)`
- `public static void addSmelting( Item input, @Nonnull ItemStack output, float xp)`
- `public static void addSmelting(@Nonnull ItemStack input, @Nonnull ItemStack output, float xp)`
- `public static void registerTileEntity(java.lang.Class<? extends TileEntity > tileEntityClass, java.lang.String id)`
- `public static void registerTileEntityWithAlternatives(java.lang.Class<? extends TileEntity > tileEntityClass, java.lang.String id, java.lang.String... alternatives)`
- `public static void registerFuelHandler( IFuelHandler handler)`
- `public static int getFuelValue(@Nonnull ItemStack itemStack)`
- `@Nonnull public static ItemStack makeItemStack(java.lang.String itemName, int meta, int stackSize, java.lang.String nbtString)`

## Description

ItemStackHolder can be used to automatically populate public static final fields with ItemStack instances, referring a specific item, potentially configured with NBT.