# Biome

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Biome> → net.minecraft.world.biome.Biome

## Class signature

```java
public abstract class Biome extends IForgeRegistryEntry.Impl<Biome>
```

## Constructors

- `Biome(Biome.BiomeProperties properties)`

## Methods

- `void addDefaultFlowers()` — Adds the default flowers, as of 1.7, it is 2 yellow, and 1 red.
- `void addFlower(IBlockState state, int weight)` — Register a new plant to be planted when bonemeal is used on grass.
- `boolean canRain()`
- `BiomeDecorator createBiomeDecorator()`
- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `void generateBiomeTerrain(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `void genTerrainBlocks(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int x, int z, double noiseVal)`
- `float getBaseHeight()`
- `static Biome getBiome(int id)`
- `static Biome getBiome(int biomeId, Biome fallback)`
- `java.lang.Class<? extends Biome> getBiomeClass()`
- `static Biome getBiomeForId(int id)`
- `java.lang.String getBiomeName()`
- `float getDefaultTemperature()`
- `boolean getEnableSnow()`
- `int getFoliageColorAtPos(BlockPos pos)`
- `int getGrassColorAtPos(BlockPos pos)`
- `float getHeightVariation()`
- `static int getIdForBiome(Biome biome)`
- `BiomeDecorator getModdedBiomeDecorator(BiomeDecorator original)`
- `int getModdedBiomeFoliageColor(int original)`
- `int getModdedBiomeGrassColor(int original)`
- `static Biome getMutationForBiome(Biome biome)`
- `float getRainfall()`
- `WorldGenAbstractTree getRandomTreeFeature(java.util.Random rand)`
- `WorldGenerator getRandomWorldGenForGrass(java.util.Random rand)`
- `int getSkyColorByTemp(float currentTemperature)`
- `java.util.List<Biome.SpawnListEntry> getSpawnableList(EnumCreatureType creatureType)`
- `float getSpawningChance()`
- `Biome.TempCategory getTempCategory()`
- `float getTemperature(BlockPos pos)`
- `int getWaterColor()`
- `int getWaterColorMultiplier()`
- `boolean ignorePlayerSpawnSuitability()`
- `boolean isHighHumidity()`
- `boolean isMutation()`
- `boolean isSnowyBiome()`
- `BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`
- `void plantFlower(World world, java.util.Random rand, BlockPos pos)`
- `static void registerBiome(int id, java.lang.String name, Biome biome)`
- `static void registerBiomes()`

## Fields

- `protected static IBlockState AIR`
- `protected static IBlockState BEDROCK`
- `protected static WorldGenBigTree BIG_TREE_FEATURE`
- `BiomeDecorator decorator`
- `protected static WorldGenDoublePlant DOUBLE_PLANT_GENERATOR`
- `IBlockState fillerBlock`
- `protected java.util.List<Biome.FlowerEntry> flowers`
- `protected static NoiseGeneratorPerlin GRASS_COLOR_NOISE`
- `protected static IBlockState GRAVEL`
- `protected static IBlockState ICE`
- `protected java.util.Map<EnumCreatureType, java.util.List<Biome.SpawnListEntry>> modSpawnableLists`
- `static ObjectIntIdentityMap<Biome> MUTATION_TO_BASE_ID_MAP`
- `protected static IBlockState RED_SANDSTONE`
- `static RegistryNamespaced<ResourceLocation, Biome> REGISTRY`
- `protected static IBlockState SANDSTONE`
- `protected java.util.List<Biome.SpawnListEntry> spawnableCaveCreatureList`
- `protected java.util.List<Biome.SpawnListEntry> spawnableCreatureList`
- `protected java.util.List<Biome.SpawnListEntry> spawnableMonsterList`
- `protected java.util.List<Biome.SpawnListEntry> spawnableWaterCreatureList`
- `protected static IBlockState STONE`
- `protected static WorldGenSwamp SWAMP_FEATURE`
- `protected static NoiseGeneratorPerlin TEMPERATURE_NOISE`
- `IBlockState topBlock`
- `protected static WorldGenTrees TREE_FEATURE`
- `protected static IBlockState WATER`