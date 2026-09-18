---
title: "StructureStart"
description: "public abstract class StructureStart extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/structure/StructureStart.html"
sourceType: javadoc
---

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
- `public java.util.List< StructureComponent > getComponents()`
- `public void generateStructure( World worldIn, java.util.Random rand, StructureBoundingBox structurebb)`
- `protected void updateBoundingBox()`
- `public NBTTagCompound writeStructureComponentsToNBT(int chunkX, int chunkZ)`
- `public void writeToNBT( NBTTagCompound tagCompound)`
- `public void readStructureComponentsFromNBT( World worldIn, NBTTagCompound tagCompound)`
- `public void readFromNBT( NBTTagCompound tagCompound)`
- `protected void markAvailableHeight( World worldIn, java.util.Random rand, int p_75067_3_)`
- `protected void setRandomHeight( World worldIn, java.util.Random rand, int p_75070_3_, int p_75070_4_)`
- `public boolean isSizeableStructure()`
- `public boolean isValidForPostProcess( ChunkPos pair)`
- `public void notifyPostProcessAt( ChunkPos pair)`
- `public int getChunkPosX()`
- `public int getChunkPosZ()`
