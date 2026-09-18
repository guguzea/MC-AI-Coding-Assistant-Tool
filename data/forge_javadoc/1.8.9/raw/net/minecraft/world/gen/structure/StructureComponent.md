---
title: "StructureComponent"
description: "The type ID of this component."
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureComponent.html"
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

- `public NBTTagCompound createStructureBaseNBT()`
- `protected abstract void writeStructureToNBT( NBTTagCompound tagCompound)`
- `public void readStructureBaseNBT( World worldIn, NBTTagCompound tagCompound)`
- `protected abstract void readStructureFromNBT( NBTTagCompound tagCompound)`
- `public void buildComponent( StructureComponent componentIn, java.util.List< StructureComponent > listIn, java.util.Random rand)`
- `public abstract boolean addComponentParts( World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `public StructureBoundingBox getBoundingBox()`
- `public int getComponentType()`
- `public static StructureComponent findIntersecting(java.util.List< StructureComponent > listIn, StructureBoundingBox boundingboxIn)`
- `public BlockPos getBoundingBoxCenter()`
- `protected boolean isLiquidInStructureBoundingBox( World worldIn, StructureBoundingBox boundingboxIn)`
- `protected int getXWithOffset(int x, int z)`
- `protected int getYWithOffset(int y)`
- `protected int getZWithOffset(int x, int z)`
- `protected int getMetadataWithOffset( Block blockIn, int meta)`
- `protected void setBlockState( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected IBlockState getBlockStateFromPos( World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void fillWithAir( World worldIn, StructureBoundingBox structurebb, int minX, int minY, int minZ, int maxX, int maxY, int maxZ)`
- `protected void fillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected void fillWithRandomizedBlocks( World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean alwaysReplace, java.util.Random rand, StructureComponent.BlockSelector blockselector)`
- `protected void func_175805_a( World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstate1, IBlockState blockstate2, boolean p_175805_13_)`
- `protected void randomlyPlaceBlock( World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int x, int y, int z, IBlockState blockstateIn)`
- `protected void randomlyRareFillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstateIn, boolean p_180777_10_)`
- `protected void clearCurrentPositionBlocksUpwards( World worldIn, int x, int y, int z, StructureBoundingBox structurebb)`
- `protected void replaceAirAndLiquidDownwards( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected boolean generateChestContents( World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, java.util.List< WeightedRandomChestContent > listIn, int max)`
- `protected boolean generateDispenserContents( World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, int meta, java.util.List< WeightedRandomChestContent > listIn, int max)`
- `protected void placeDoorCurrentPosition( World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, EnumFacing facing)`
- `public void func_181138_a(int p_181138_1_, int p_181138_2_, int p_181138_3_)`

## Description

The type ID of this component.
