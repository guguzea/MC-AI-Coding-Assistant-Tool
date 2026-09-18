---
title: "StructureComponent"
description: "public abstract class StructureComponent extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/structure/StructureComponent.html"
sourceType: javadoc
---

# StructureComponent

## Class signature

```java
public abstract class StructureComponent extends java.lang.Object
```

## Constructors

- `public StructureComponent()`
- `protected StructureComponent(int type)`

## Methods

- `public final NBTTagCompound createStructureBaseNBT()`
- `protected abstract void writeStructureToNBT( NBTTagCompound tagCompound)`
- `public void readStructureBaseNBT( World worldIn, NBTTagCompound tagCompound)`
- `protected abstract void readStructureFromNBT( NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `public void buildComponent( StructureComponent componentIn, java.util.List< StructureComponent > listIn, java.util.Random rand)`
- `public abstract boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `public StructureBoundingBox getBoundingBox()`
- `public int getComponentType()`
- `public static StructureComponent findIntersecting(java.util.List< StructureComponent > listIn, StructureBoundingBox boundingboxIn)`
- `protected boolean isLiquidInStructureBoundingBox( World worldIn, StructureBoundingBox boundingboxIn)`
- `protected int getXWithOffset(int x, int z)`
- `protected int getYWithOffset(int y)`
- `protected int getZWithOffset(int x, int z)`
- `protected void setBlockState( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected IBlockState getBlockStateFromPos( World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected int getSkyBrightness( World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void fillWithAir( World worldIn, StructureBoundingBox structurebb, int minX, int minY, int minZ, int maxX, int maxY, int maxZ)`
- `protected void fillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected void fillWithRandomizedBlocks( World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean alwaysReplace, java.util.Random rand, StructureComponent.BlockSelector blockselector)`
- `protected void generateMaybeBox( World worldIn, StructureBoundingBox sbb, java.util.Random rand, float chance, int x1, int y1, int z1, int x2, int y2, int z2, IBlockState edgeState, IBlockState state, boolean requireNonAir, int requiredSkylight)`
- `protected void randomlyPlaceBlock( World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int x, int y, int z, IBlockState blockstateIn)`
- `protected void randomlyRareFillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstateIn, boolean excludeAir)`
- `protected void clearCurrentPositionBlocksUpwards( World worldIn, int x, int y, int z, StructureBoundingBox structurebb)`
- `protected void replaceAirAndLiquidDownwards( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected boolean generateChest( World worldIn, StructureBoundingBox structurebb, java.util.Random randomIn, int x, int y, int z, ResourceLocation loot)`
- `protected boolean generateChest( World p_191080_1_, StructureBoundingBox p_191080_2_, java.util.Random p_191080_3_, BlockPos p_191080_4_, ResourceLocation p_191080_5_, IBlockState p_191080_6_)`
- `protected boolean createDispenser( World worldIn, StructureBoundingBox sbb, java.util.Random rand, int x, int y, int z, EnumFacing facing, ResourceLocation lootTableIn)`
- `protected void generateDoor( World worldIn, StructureBoundingBox sbb, java.util.Random rand, int x, int y, int z, EnumFacing facing, BlockDoor door)`
- `public void offset(int x, int y, int z)`
- `public EnumFacing getCoordBaseMode()`
- `public void setCoordBaseMode( EnumFacing facing)`
