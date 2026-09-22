---
title: "StructureStart"
description: "public abstract class StructureStart extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/structure/StructureStart.html"
sourceType: javadoc
---

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

- `void generateStructure(World worldIn, java.util.Random rand, StructureBoundingBox structurebb)`
- `StructureBoundingBox getBoundingBox()`
- `int getChunkPosX()`
- `int getChunkPosZ()`
- `java.util.List<StructureComponent> getComponents()`
- `boolean isSizeableStructure()`
- `boolean isValidForPostProcess(ChunkPos pair)`
- `protected void markAvailableHeight(World worldIn, java.util.Random rand, int p_75067_3_)`
- `void notifyPostProcessAt(ChunkPos pair)`
- `void readFromNBT(NBTTagCompound tagCompound)`
- `void readStructureComponentsFromNBT(World worldIn, NBTTagCompound tagCompound)`
- `protected void setRandomHeight(World worldIn, java.util.Random rand, int p_75070_3_, int p_75070_4_)`
- `protected void updateBoundingBox()`
- `NBTTagCompound writeStructureComponentsToNBT(int chunkX, int chunkZ)`
- `void writeToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected StructureBoundingBox boundingBox`
- `protected java.util.List<StructureComponent> components`
