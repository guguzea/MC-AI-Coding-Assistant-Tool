---
title: "Template"
description: "public class Template extends java.lang.Object"
package: "net/minecraft/world/gen/structure/template"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/structure/template/Template.html"
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

- `void addBlocksToWorld(World p_189960_1_, BlockPos p_189960_2_, ITemplateProcessor p_189960_3_, PlacementSettings p_189960_4_, int p_189960_5_)`
- `void addBlocksToWorld(World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `void addBlocksToWorld(World worldIn, BlockPos pos, PlacementSettings placementIn, int flags)`
- `void addBlocksToWorldChunk(World worldIn, BlockPos pos, PlacementSettings placementIn)`
- `BlockPos calculateConnectedPos(PlacementSettings placementIn, BlockPos p_186262_2_, PlacementSettings p_186262_3_, BlockPos p_186262_4_)`
- `java.lang.String getAuthor()`
- `java.util.Map<BlockPos, java.lang.String> getDataBlocks(BlockPos pos, PlacementSettings placementIn)`
- `BlockPos getSize()`
- `BlockPos getZeroPositionWithTransform(BlockPos p_189961_1_, Mirror p_189961_2_, Rotation p_189961_3_)`
- `static BlockPos getZeroPositionWithTransform(BlockPos p_191157_0_, Mirror p_191157_1_, Rotation p_191157_2_, int p_191157_3_, int p_191157_4_)`
- `void read(NBTTagCompound compound)`
- `static void registerFixes(DataFixer fixer)`
- `void setAuthor(java.lang.String authorIn)`
- `void takeBlocksFromWorld(World worldIn, BlockPos startPos, BlockPos endPos, boolean takeEntities, Block toIgnore)`
- `static BlockPos transformedBlockPos(PlacementSettings placementIn, BlockPos p_186266_1_)`
- `BlockPos transformedSize(Rotation rotationIn)`
- `NBTTagCompound writeToNBT(NBTTagCompound nbt)`
