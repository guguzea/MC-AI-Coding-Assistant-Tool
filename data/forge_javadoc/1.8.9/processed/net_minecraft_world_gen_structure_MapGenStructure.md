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
- `boolean func_175795_b(BlockPos pos)`
- `boolean func_175796_a(World worldIn, BlockPos pos)`
- `protected StructureStart func_175797_c(BlockPos pos)`
- `boolean generateStructure(World worldIn, java.util.Random randomIn, ChunkCoordIntPair chunkCoord)`
- `BlockPos getClosestStrongholdPos(World worldIn, BlockPos pos)`
- `protected java.util.List<BlockPos> getCoordList()`
- `abstract java.lang.String getStructureName()`
- `protected abstract StructureStart getStructureStart(int chunkX, int chunkZ)`
- `protected void recursiveGenerate(World worldIn, int chunkX, int chunkZ, int p_180701_4_, int p_180701_5_, ChunkPrimer chunkPrimerIn)` — Recursively called by generate()

## Fields

- `protected java.util.Map<java.lang.Long, StructureStart> structureMap`