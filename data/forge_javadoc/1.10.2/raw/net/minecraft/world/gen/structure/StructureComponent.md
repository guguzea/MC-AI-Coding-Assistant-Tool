---
title: "StructureComponent"
description: "public abstract class StructureComponent extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/gen/structure/StructureComponent.html"
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
- `protected void setBlockState( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected IBlockState getBlockStateFromPos( World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected int func_189916_b( World p_189916_1_, int p_189916_2_, int p_189916_3_, int p_189916_4_, StructureBoundingBox p_189916_5_)`
- `protected void fillWithAir( World worldIn, StructureBoundingBox structurebb, int minX, int minY, int minZ, int maxX, int maxY, int maxZ)`
- `protected void fillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected void fillWithRandomizedBlocks( World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean alwaysReplace, java.util.Random rand, StructureComponent.BlockSelector blockselector)`
- `protected void func_189914_a( World p_189914_1_, StructureBoundingBox p_189914_2_, java.util.Random p_189914_3_, float p_189914_4_, int p_189914_5_, int p_189914_6_, int p_189914_7_, int p_189914_8_, int p_189914_9_, int p_189914_10_, IBlockState p_189914_11_, IBlockState p_189914_12_, boolean p_189914_13_, int p_189914_14_)`
- `protected void randomlyPlaceBlock( World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int x, int y, int z, IBlockState blockstateIn)`
- `protected void randomlyRareFillWithBlocks( World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstateIn, boolean excludeAir)`
- `protected void clearCurrentPositionBlocksUpwards( World worldIn, int x, int y, int z, StructureBoundingBox structurebb)`
- `protected void replaceAirAndLiquidDownwards( World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected boolean generateChest( World worldIn, StructureBoundingBox structurebb, java.util.Random randomIn, int x, int y, int z, ResourceLocation loot)`
- `protected boolean createDispenser( World p_189419_1_, StructureBoundingBox p_189419_2_, java.util.Random p_189419_3_, int p_189419_4_, int p_189419_5_, int p_189419_6_, EnumFacing p_189419_7_, ResourceLocation p_189419_8_)`
- `protected void func_189915_a( World p_189915_1_, StructureBoundingBox p_189915_2_, java.util.Random p_189915_3_, int p_189915_4_, int p_189915_5_, int p_189915_6_, EnumFacing p_189915_7_, BlockDoor p_189915_8_)`
- `public void offset(int x, int y, int z)`
- `@Nullable public EnumFacing getCoordBaseMode()`
- `public void setCoordBaseMode(@Nullable EnumFacing facing)`
