# StructureStart

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureStart

## Class signature

```java
public abstract class StructureStart extends java.lang.Object
```

## Constructors

- `StructureStart()`
- `StructureStart(int chunkX, int chunkZ)`

## Methods

- `void func_175787_b(ChunkCoordIntPair pair)`
- `boolean func_175788_a(ChunkCoordIntPair pair)`
- `void generateStructure(World worldIn, java.util.Random rand, StructureBoundingBox structurebb)` — Keeps iterating Structure Pieces and spawning them until the checks tell it to stop
- `StructureBoundingBox getBoundingBox()`
- `int getChunkPosX()`
- `int getChunkPosZ()`
- `java.util.LinkedList<StructureComponent> getComponents()`
- `boolean isSizeableStructure()` — currently only defined for Villages, returns true if Village has more than 2 non-road components
- `protected void markAvailableHeight(World worldIn, java.util.Random rand, int p_75067_3_)` — offsets the structure Bounding Boxes up to a certain height, typically 63 - 10
- `void readFromNBT(NBTTagCompound tagCompound)`
- `void readStructureComponentsFromNBT(World worldIn, NBTTagCompound tagCompound)`
- `protected void setRandomHeight(World worldIn, java.util.Random rand, int p_75070_3_, int p_75070_4_)`
- `protected void updateBoundingBox()` — Calculates total bounding box based on components' bounding boxes and saves it to boundingBox
- `NBTTagCompound writeStructureComponentsToNBT(int chunkX, int chunkZ)`
- `void writeToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected StructureBoundingBox boundingBox`
- `protected java.util.LinkedList<StructureComponent> components`