---
title: "StructureOceanMonumentPieces.Piece"
description: "public abstract static class StructureOceanMonumentPieces.Piece extends StructureComponent"
package: "net/minecraft/world/gen/structure"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/gen/structure/StructureOceanMonumentPieces.Piece.html"
sourceType: javadoc
---

# StructureOceanMonumentPieces.Piece

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent → net.minecraft.world.gen.structure.StructureOceanMonumentPieces.Piece

## Class signature

```java
public abstract static class StructureOceanMonumentPieces.Piece extends StructureComponent
```

## Constructors

- `Piece()`
- `Piece(EnumFacing p_i45589_1_, StructureBoundingBox p_i45589_2_)`
- `Piece(int p_i45588_1_)`
- `Piece(int p_i45590_1_, EnumFacing p_i45590_2_, net.minecraft.world.gen.structure.StructureOceanMonumentPieces.RoomDefinition p_i45590_3_, int p_i45590_4_, int p_i45590_5_, int p_i45590_6_)`

## Methods

- `protected boolean doesChunkIntersect(StructureBoundingBox p_175818_1_, int p_175818_2_, int p_175818_3_, int p_175818_4_, int p_175818_5_)`
- `protected void generateBoxOnFillOnly(World worldIn, StructureBoundingBox p_175819_2_, int p_175819_3_, int p_175819_4_, int p_175819_5_, int p_175819_6_, int p_175819_7_, int p_175819_8_, IBlockState p_175819_9_)`
- `protected void generateDefaultFloor(World worldIn, StructureBoundingBox p_175821_2_, int p_175821_3_, int p_175821_4_, boolean p_175821_5_)`
- `protected void generateWaterBox(World p_181655_1_, StructureBoundingBox p_181655_2_, int p_181655_3_, int p_181655_4_, int p_181655_5_, int p_181655_6_, int p_181655_7_, int p_181655_8_, boolean p_181655_9_)`
- `protected static int getRoomIndex(int p_175820_0_, int p_175820_1_, int p_175820_2_)`
- `protected void readStructureFromNBT(NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `protected boolean spawnElder(World worldIn, StructureBoundingBox p_175817_2_, int p_175817_3_, int p_175817_4_, int p_175817_5_)`
- `protected void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected static IBlockState BRICKS_PRISMARINE`
- `protected static IBlockState DARK_PRISMARINE`
- `protected static IBlockState DOT_DECO_DATA`
- `protected static int GRIDROOM_LEFTWING_CONNECT_INDEX`
- `protected static int GRIDROOM_RIGHTWING_CONNECT_INDEX`
- `protected static int GRIDROOM_SOURCE_INDEX`
- `protected static int GRIDROOM_TOP_CONNECT_INDEX`
- `protected net.minecraft.world.gen.structure.StructureOceanMonumentPieces.RoomDefinition roomDefinition`
- `protected static IBlockState ROUGH_PRISMARINE`
- `protected static IBlockState SEA_LANTERN`
- `protected static IBlockState WATER`
