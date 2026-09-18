---
title: "Template"
description: "public class Template extends java.lang.Object"
package: "net/minecraft/world/gen/structure/template"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/gen/structure/template/Template.html"
sourceType: javadoc
---

# Template

## Class signature

```java
public class Template extends java.lang.Object
```

## Constructors

- `public Template()`

## Methods

- `public BlockPos getSize()`
- `public void setAuthor(java.lang.String authorIn)`
- `public java.lang.String getAuthor()`
- `public void takeBlocksFromWorld( World worldIn, BlockPos startPos, BlockPos endPos, boolean takeEntities, @Nullable Block p_186254_5_)`
- `public java.util.Map< BlockPos ,java.lang.String> getDataBlocks( BlockPos pos, PlacementSettings placementIn)`
- `public BlockPos calculateConnectedPos( PlacementSettings placementIn, BlockPos p_186262_2_, PlacementSettings p_186262_3_, BlockPos p_186262_4_)`
- `public static BlockPos transformedBlockPos( PlacementSettings placementIn, BlockPos p_186266_1_)`
- `public void addBlocksToWorldChunk( World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `public void addBlocksToWorld( World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `public BlockPos transformedSize( Rotation rotationIn)`
- `public NBTTagCompound writeToNBT( NBTTagCompound p_189552_1_)`
- `public void read( NBTTagCompound compound)`
