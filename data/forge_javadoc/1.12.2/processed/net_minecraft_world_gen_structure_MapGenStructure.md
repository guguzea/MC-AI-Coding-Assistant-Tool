# MapGenStructure

## Class signature

```java
public abstract class MapGenStructure extends MapGenBase
```

## Constructors

- `public MapGenStructure()`

## Methods

- `public abstract java.lang.String getStructureName()`
- `protected final void recursiveGenerate( World worldIn, int chunkX, int chunkZ, int originalX, int originalZ, ChunkPrimer chunkPrimerIn)`
- `public boolean generateStructure( World worldIn, java.util.Random randomIn, ChunkPos chunkCoord)`
- `public boolean isInsideStructure( BlockPos pos)`
- `protected StructureStart getStructureAt( BlockPos pos)`
- `public boolean isPositionInStructure( World worldIn, BlockPos pos)`
- `public abstract BlockPos getNearestStructurePos( World worldIn, BlockPos pos, boolean findUnexplored)`
- `protected void initializeStructureData( World worldIn)`
- `protected abstract boolean canSpawnStructureAtCoords(int chunkX, int chunkZ)`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`
- `protected static BlockPos findNearestStructurePosBySpacing( World worldIn, MapGenStructure p_191069_1_, BlockPos p_191069_2_, int p_191069_3_, int p_191069_4_, int p_191069_5_, boolean p_191069_6_, int p_191069_7_, boolean findUnexplored)`