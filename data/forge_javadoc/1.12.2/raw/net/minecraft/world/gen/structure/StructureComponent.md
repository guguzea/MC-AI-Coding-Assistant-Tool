---
title: "StructureComponent"
description: "public abstract class StructureComponent extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/gen/structure/StructureComponent.html"
sourceType: javadoc
---

# StructureComponent

**Inheritance:** java.lang.Object → net.minecraft.world.gen.structure.StructureComponent

## Class signature

```java
public abstract class StructureComponent extends java.lang.Object
```

## Constructors

- `StructureComponent()`
- `StructureComponent(int type)`

## Methods

- `abstract boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)`
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)`
- `protected void clearCurrentPositionBlocksUpwards(World worldIn, int x, int y, int z, StructureBoundingBox structurebb)`
- `protected boolean createDispenser(World worldIn, StructureBoundingBox sbb, java.util.Random rand, int x, int y, int z, EnumFacing facing, ResourceLocation lootTableIn)`
- `NBTTagCompound createStructureBaseNBT()`
- `protected void fillWithAir(World worldIn, StructureBoundingBox structurebb, int minX, int minY, int minZ, int maxX, int maxY, int maxZ)`
- `protected void fillWithBlocks(World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)`
- `protected void fillWithRandomizedBlocks(World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean alwaysReplace, java.util.Random rand, StructureComponent.BlockSelector blockselector)`
- `static StructureComponent findIntersecting(java.util.List<StructureComponent> listIn, StructureBoundingBox boundingboxIn)`
- `protected boolean generateChest(World p_191080_1_, StructureBoundingBox p_191080_2_, java.util.Random p_191080_3_, BlockPos p_191080_4_, ResourceLocation p_191080_5_, IBlockState p_191080_6_)`
- `protected boolean generateChest(World worldIn, StructureBoundingBox structurebb, java.util.Random randomIn, int x, int y, int z, ResourceLocation loot)`
- `protected void generateDoor(World worldIn, StructureBoundingBox sbb, java.util.Random rand, int x, int y, int z, EnumFacing facing, BlockDoor door)`
- `protected void generateMaybeBox(World worldIn, StructureBoundingBox sbb, java.util.Random rand, float chance, int x1, int y1, int z1, int x2, int y2, int z2, IBlockState edgeState, IBlockState state, boolean requireNonAir, int requiredSkylight)`
- `protected IBlockState getBlockStateFromPos(World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `StructureBoundingBox getBoundingBox()`
- `int getComponentType()`
- `EnumFacing getCoordBaseMode()`
- `protected int getSkyBrightness(World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected int getXWithOffset(int x, int z)`
- `protected int getYWithOffset(int y)`
- `protected int getZWithOffset(int x, int z)`
- `protected boolean isLiquidInStructureBoundingBox(World worldIn, StructureBoundingBox boundingboxIn)`
- `void offset(int x, int y, int z)`
- `protected void randomlyPlaceBlock(World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int x, int y, int z, IBlockState blockstateIn)`
- `protected void randomlyRareFillWithBlocks(World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstateIn, boolean excludeAir)`
- `void readStructureBaseNBT(World worldIn, NBTTagCompound tagCompound)`
- `protected abstract void readStructureFromNBT(NBTTagCompound tagCompound, TemplateManager p_143011_2_)`
- `protected void replaceAirAndLiquidDownwards(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected void setBlockState(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `void setCoordBaseMode(EnumFacing facing)`
- `protected abstract void writeStructureToNBT(NBTTagCompound tagCompound)`

## Fields

- `protected StructureBoundingBox boundingBox`
- `protected int componentType`
