# StructureStart

## Class signature

```java
public abstract class StructureStart extends java.lang.Object
```

## Constructors

- `public StructureStart()`
- `public StructureStart(int chunkX, int chunkZ)`

## Methods

- `public StructureBoundingBox getBoundingBox()`
- `public java.util.LinkedList< StructureComponent > getComponents()`
- `public void generateStructure( World worldIn, java.util.Random rand, StructureBoundingBox structurebb)`
- `protected void updateBoundingBox()`
- `public NBTTagCompound writeStructureComponentsToNBT(int chunkX, int chunkZ)`
- `public void writeToNBT( NBTTagCompound tagCompound)`
- `public void readStructureComponentsFromNBT( World worldIn, NBTTagCompound tagCompound)`
- `public void readFromNBT( NBTTagCompound tagCompound)`
- `protected void markAvailableHeight( World worldIn, java.util.Random rand, int p_75067_3_)`
- `protected void setRandomHeight( World worldIn, java.util.Random rand, int p_75070_3_, int p_75070_4_)`
- `public boolean isSizeableStructure()`
- `public boolean func_175788_a( ChunkCoordIntPair pair)`
- `public void func_175787_b( ChunkCoordIntPair pair)`
- `public int getChunkPosX()`
- `public int getChunkPosZ()`

## Description

Keeps iterating Structure Pieces and spawning them until the checks tell it to stop