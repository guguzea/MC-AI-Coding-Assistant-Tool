# MapGenStructure

**Inheritance:** java.lang.Object → net.minecraft.world.gen.MapGenBase → net.minecraft.world.gen.structure.MapGenStructure

## Class signature

```java
public abstract class MapGenStructure extends MapGenBase
```

## Constructors

- `MapGenStructure()`

## Methods

- `protected abstract boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `protected static BlockPos findNearestStructurePosBySpacing(World p_191069_0_, MapGenStructure p_191069_1_, BlockPos p_191069_2_, int p_191069_3_, int p_191069_4_, int p_191069_5_, boolean p_191069_6_, int p_191069_7_, boolean findUnexplored)`
- `boolean generateStructure(World worldIn, java.util.Random randomIn, ChunkPos chunkCoord)`
- `abstract BlockPos getClosestStrongholdPos(World worldIn, BlockPos pos, boolean p_180706_3_)`
- `protected StructureStart getStructureAt(BlockPos pos)`
- `abstract java.lang.String getStructureName()`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`
- `protected void initializeStructureData(World worldIn)`
- `boolean isInsideStructure(BlockPos pos)`
- `boolean isPositionInStructure(World worldIn, BlockPos pos)`
- `protected void recursiveGenerate(World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)`

## Fields

- `protected it.unimi.dsi.fastutil.longs.Long2ObjectMap<StructureStart> structureMap`