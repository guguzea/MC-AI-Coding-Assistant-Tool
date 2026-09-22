# MapGenStructure

**Inheritance:** java.lang.Object → net.minecraft.world.gen.MapGenBase → net.minecraft.world.gen.structure.MapGenStructure

## Class signature

```java
public abstract class MapGenStructure extends MapGenBase
```

## Constructors

- `MapGenStructure()`

## Methods

- `protected abstract boolean canSpawnStructureAtCoords(int p_75047_1_, int p_75047_2_)`
- `boolean func_142038_b(int p_142038_1_, int p_142038_2_, int p_142038_3_)`
- `abstract java.lang.String func_143025_a()`
- `protected StructureStart func_143028_c(int p_143028_1_, int p_143028_2_, int p_143028_3_)`
- `protected void func_151538_a(World p_151538_1_, int p_151538_2_, int p_151538_3_, int p_151538_4_, int p_151538_5_, Block [] p_151538_6_)`
- `ChunkPosition func_151545_a(World p_151545_1_, int p_151545_2_, int p_151545_3_, int p_151545_4_)`
- `boolean generateStructuresInChunk(World p_75051_1_, java.util.Random p_75051_2_, int p_75051_3_, int p_75051_4_)`
- `protected java.util.List getCoordList()`
- `protected abstract StructureStart getStructureStart(int p_75049_1_, int p_75049_2_)`
- `boolean hasStructureAt(int p_75048_1_, int p_75048_2_, int p_75048_3_)`

## Fields

- `protected java.util.Map structureMap`