# BiomeGenBase

**Inheritance:** java.lang.Object → net.minecraft.world.biome.BiomeGenBase

## Class signature

```java
public abstract class BiomeGenBase extends java.lang.Object
```

## Constructors

- `BiomeGenBase(int id)`
- `BiomeGenBase(int id, boolean register)`

## Methods

- `void addDefaultFlowers()` — Adds the default flowers, as of 1.7, it is 2 yellow, and 1 red.
- `void addFlower(IBlockState state, int weight)` — Register a new plant to be planted when bonemeal is used on grass.
- `boolean canSpawnLightningBolt()` — Return true if the biome supports lightning bolt spawn, either by have the bolts enabled and have rain enabled.
- `BiomeDecorator createBiomeDecorator()` — Allocate a new BiomeDecorator for this BiomeGenBase
- `BiomeGenBase createMutatedBiome(int p_180277_1_)`
- `BiomeGenBase createMutation()` — Creates a mutated version of the biome and places it into the biomeList with an index equal to the original plus 128
- `void decorate(World worldIn, java.util.Random rand, BlockPos pos)`
- `BiomeGenBase func_150557_a(int p_150557_1_, boolean p_150557_2_)`
- `BiomeGenBase func_150563_c(int p_150563_1_)`
- `WorldGenAbstractTree genBigTreeChance(java.util.Random rand)`
- `void generateBiomeTerrain(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int p_180628_4_, int p_180628_5_, double p_180628_6_)`
- `void genTerrainBlocks(World worldIn, java.util.Random rand, ChunkPrimer chunkPrimerIn, int p_180622_4_, int p_180622_5_, double p_180622_6_)`
- `static BiomeGenBase getBiome(int id)` — return the biome specified by biomeID, or 0 (ocean) if out of bounds
- `java.lang.Class<? extends BiomeGenBase> getBiomeClass()`
- `static BiomeGenBase getBiomeFromBiomeList(int biomeId, BiomeGenBase biome)`
- `static BiomeGenBase [] getBiomeGenArray()`
- `boolean getEnableSnow()` — Returns true if the biome have snowfall instead a normal rain.
- `float getFloatRainfall()` — Gets a floating point representation of this biome's rainfall
- `float getFloatTemperature(BlockPos pos)` — Gets a floating point representation of this biome's temperature
- `int getFoliageColorAtPos(BlockPos pos)`
- `int getGrassColorAtPos(BlockPos pos)`
- `int getIntRainfall()` — Gets an integer representation of this biome's rainfall
- `BiomeDecorator getModdedBiomeDecorator(BiomeDecorator original)`
- `int getModdedBiomeFoliageColor(int original)`
- `int getModdedBiomeGrassColor(int original)`
- `WorldGenerator getRandomWorldGenForGrass(java.util.Random rand)` — Gets a WorldGen appropriate for this biome.
- `int getSkyColorByTemp(float p_76731_1_)` — takes temperature, returns color
- `java.util.List<BiomeGenBase.SpawnListEntry> getSpawnableList(EnumCreatureType creatureType)`
- `float getSpawningChance()` — returns the chance a creature has to spawn.
- `BiomeGenBase.TempCategory getTempCategory()`
- `int getWaterColorMultiplier()`
- `boolean isEqualTo(BiomeGenBase biome)` — returns true if the biome specified is equal to this biome
- `boolean isHighHumidity()` — Checks to see if the rainfall level of the biome is extremely high
- `boolean isSnowyBiome()`
- `BlockFlower.EnumFlowerType pickRandomFlower(java.util.Random rand, BlockPos pos)`
- `void plantFlower(World world, java.util.Random rand, BlockPos pos)`
- `BiomeGenBase setBiomeName(java.lang.String name)`
- `BiomeGenBase setColor(int colorIn)`
- `BiomeGenBase setDisableRain()` — Disable the rain for the biome.
- `BiomeGenBase setEnableSnow()` — sets enableSnow to true during biome initialization. returns BiomeGenBase.
- `BiomeGenBase setFillerBlockMetadata(int meta)`
- `BiomeGenBase setHeight(BiomeGenBase.Height heights)`
- `BiomeGenBase setTemperatureRainfall(float temperatureIn, float rainfallIn)` — Sets the temperature and rainfall of this biome.

## Fields

- `static BiomeGenBase beach` — Beach biome.
- `static java.util.Map<java.lang.String, BiomeGenBase> BIOME_ID_MAP`
- `int biomeID` — The id number to this biome, and its index in the biomeList array.
- `java.lang.String biomeName`
- `static BiomeGenBase birchForest`
- `static BiomeGenBase birchForestHills`
- `static BiomeGenBase coldBeach`
- `static BiomeGenBase coldTaiga`
- `static BiomeGenBase coldTaigaHills`
- `int color`
- `static BiomeGenBase deepOcean`
- `static BiomeGenBase desert`
- `static BiomeGenBase desertHills` — Desert Hills biome.
- `protected static WorldGenDoublePlant DOUBLE_PLANT_GENERATOR`
- `protected boolean enableRain` — Is true (default) if the biome support rain (desert and nether can't have rain)
- `protected boolean enableSnow` — Set to true if snow is enabled for this biome.
- `static java.util.Set<BiomeGenBase> explorationBiomesList`
- `static BiomeGenBase extremeHills`
- `static BiomeGenBase extremeHillsEdge` — Extreme Hills Edge biome.
- `static BiomeGenBase extremeHillsPlus`
- `int field_150609_ah`
- `static BiomeGenBase field_180279_ad`
- `IBlockState fillerBlock` — The block to fill spots in when not on the top
- `int fillerBlockMetadata`
- `protected java.util.List<BiomeGenBase.FlowerEntry> flowers`
- `static BiomeGenBase forest`
- `static BiomeGenBase forestHills` — Forest Hills biome.
- `static BiomeGenBase frozenOcean`
- `static BiomeGenBase frozenRiver`
- `protected static NoiseGeneratorPerlin GRASS_COLOR_NOISE`
- `protected static BiomeGenBase.Height height_DeepOceans`
- `protected static BiomeGenBase.Height height_Default`
- `protected static BiomeGenBase.Height height_HighPlateaus`
- `protected static BiomeGenBase.Height height_LowHills`
- `protected static BiomeGenBase.Height height_LowIslands`
- `protected static BiomeGenBase.Height height_LowPlains`
- `protected static BiomeGenBase.Height height_MidHills`
- `protected static BiomeGenBase.Height height_MidPlains`
- `protected static BiomeGenBase.Height height_Oceans`
- `protected static BiomeGenBase.Height height_PartiallySubmerged`
- `protected static BiomeGenBase.Height height_RockyWaters`
- `protected static BiomeGenBase.Height height_ShallowWaters`
- `protected static BiomeGenBase.Height height_Shores`
- `static BiomeGenBase hell`
- `static BiomeGenBase iceMountains`
- `static BiomeGenBase icePlains`
- `static BiomeGenBase jungle` — Jungle biome identifier
- `static BiomeGenBase jungleEdge`
- `static BiomeGenBase jungleHills`
- `float maxHeight` — The maximum height of this biome.
- `static BiomeGenBase megaTaiga`
- `static BiomeGenBase megaTaigaHills`
- `static BiomeGenBase mesa`
- `static BiomeGenBase mesaPlateau`
- `static BiomeGenBase mesaPlateau_F`
- `float minHeight` — The minimum height of this biome.
- `static BiomeGenBase mushroomIsland`
- `static BiomeGenBase mushroomIslandShore`
- `static BiomeGenBase ocean`
- `static BiomeGenBase plains`
- `float rainfall` — The rainfall in this biome.
- `static BiomeGenBase river`
- `static BiomeGenBase roofedForest`
- `static BiomeGenBase savanna`
- `static BiomeGenBase savannaPlateau`
- `static BiomeGenBase sky` — Is the biome used for sky world.
- `protected java.util.List<BiomeGenBase.SpawnListEntry> spawnableCaveCreatureList`
- `protected java.util.List<BiomeGenBase.SpawnListEntry> spawnableCreatureList`
- `protected java.util.List<BiomeGenBase.SpawnListEntry> spawnableMonsterList`
- `protected java.util.List<BiomeGenBase.SpawnListEntry> spawnableWaterCreatureList`
- `static BiomeGenBase stoneBeach`
- `static BiomeGenBase swampland`
- `static BiomeGenBase taiga`
- `static BiomeGenBase taigaHills` — Taiga Hills biome.
- `float temperature` — The temperature of this biome.
- `protected static NoiseGeneratorPerlin temperatureNoise`
- `BiomeDecorator theBiomeDecorator` — The biome decorator.
- `IBlockState topBlock` — The block expected to be on the top of this biome
- `int waterColorMultiplier` — Color tint applied to water depending on biome
- `protected WorldGenBigTree worldGeneratorBigTree` — The big tree generator.
- `protected WorldGenSwamp worldGeneratorSwamp` — The swamp tree generator.
- `protected WorldGenTrees worldGeneratorTrees` — The tree generator.