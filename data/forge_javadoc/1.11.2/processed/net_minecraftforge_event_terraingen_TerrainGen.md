# TerrainGen

## Class signature

```java
public abstract class TerrainGen extends java.lang.Object
```

## Constructors

- `public TerrainGen()`

## Methods

- `public static <T extends InitNoiseGensEvent.Context > T getModdedNoiseGenerators( World world, java.util.Random rand, T original)`
- `public static MapGenBase getModdedMapGen( MapGenBase original, InitMapGenEvent.EventType type)`
- `public static boolean populate( IChunkGenerator chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated, PopulateChunkEvent.Populate.EventType type)`
- `public static boolean decorate( World world, java.util.Random rand, BlockPos pos, DecorateBiomeEvent.Decorate.EventType type)`
- `public static boolean generateOre( World world, java.util.Random rand, WorldGenerator generator, BlockPos pos, OreGenEvent.GenerateMinable.EventType type)`
- `public static boolean saplingGrowTree( World world, java.util.Random rand, BlockPos pos)`