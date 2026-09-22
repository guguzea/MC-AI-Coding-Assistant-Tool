---
title: "Template"
description: "public class Template extends java.lang.Object"
package: "net/minecraft/world/gen/structure/template"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/gen/structure/template/Template.html"
sourceType: javadoc
---

# Template

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.template.Template

## Class signature

```java
public class Template extends java.lang.Object
```

## Constructors

- `Template()`

## Methods

- `void addBlocksToWorld(World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `void addBlocksToWorldChunk(World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `BlockPos calculateConnectedPos(PlacementSettings placementIn, BlockPos p_186262_2_, PlacementSettings p_186262_3_, BlockPos p_186262_4_)`
- `java.lang.String getAuthor()`
- `java.util.Map<BlockPos, java.lang.String> getDataBlocks(BlockPos pos, PlacementSettings placementIn)`
- `BlockPos getSize()`
- `void read(NBTTagCompound compound)`
- `void setAuthor(java.lang.String authorIn)`
- `void takeBlocksFromWorld(World worldIn, BlockPos startPos, BlockPos endPos, boolean takeEntities, Block p_186254_5_)`
- `static BlockPos transformedBlockPos(PlacementSettings placementIn, BlockPos p_186266_1_)`
- `BlockPos transformedSize(Rotation rotationIn)`
- `NBTTagCompound writeToNBT(NBTTagCompound p_189552_1_)`
