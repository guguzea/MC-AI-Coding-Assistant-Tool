---
title: "StructureComponent"
description: "public abstract class StructureComponent extends java.lang.Object"
package: "net/minecraft/world/gen/structure"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/gen/structure/StructureComponent.html"
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

- `abstract boolean addComponentParts(World worldIn, java.util.Random randomIn, StructureBoundingBox structureBoundingBoxIn)` — second Part of Structure generating, this for example places Spiderwebs, Mob Spawners, it closes Mineshafts at the end, it adds Fences...
- `void buildComponent(StructureComponent componentIn, java.util.List<StructureComponent> listIn, java.util.Random rand)` — Initiates construction of the Structure Component picked, at the current Location of StructGen
- `protected void clearCurrentPositionBlocksUpwards(World worldIn, int x, int y, int z, StructureBoundingBox structurebb)` — Deletes all continuous blocks from selected position upwards.
- `NBTTagCompound createStructureBaseNBT()` — Writes structure base data (id, boundingbox, coordBase and componentType ) to new NBTTagCompound and returns it.
- `protected void fillWithAir(World worldIn, StructureBoundingBox structurebb, int minX, int minY, int minZ, int maxX, int maxY, int maxZ)` — arguments: (World worldObj, StructureBoundingBox structBB, int minX, int minY, int minZ, int maxX, int maxY, int maxZ)
- `protected void fillWithBlocks(World worldIn, StructureBoundingBox boundingboxIn, int xMin, int yMin, int zMin, int xMax, int yMax, int zMax, IBlockState boundaryBlockState, IBlockState insideBlockState, boolean existingOnly)` — Fill the given area with the selected blocks
- `protected void fillWithRandomizedBlocks(World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean alwaysReplace, java.util.Random rand, StructureComponent.BlockSelector blockselector)` — arguments: World worldObj, StructureBoundingBox structBB, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, boolean alwaysreplace, Random rand, StructurePieceBlockSelector blockselector
- `static StructureComponent findIntersecting(java.util.List<StructureComponent> listIn, StructureBoundingBox boundingboxIn)` — Discover if bounding box can fit within the current bounding box object.
- `protected void func_175805_a(World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstate1, IBlockState blockstate2, boolean p_175805_13_)`
- `void func_181138_a(int p_181138_1_, int p_181138_2_, int p_181138_3_)`
- `protected boolean generateChestContents(World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, java.util.List<WeightedRandomChestContent> listIn, int max)`
- `protected boolean generateDispenserContents(World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, int meta, java.util.List<WeightedRandomChestContent> listIn, int max)`
- `protected IBlockState getBlockStateFromPos(World worldIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `StructureBoundingBox getBoundingBox()`
- `BlockPos getBoundingBoxCenter()`
- `int getComponentType()` — Returns the component type ID of this component.
- `protected int getMetadataWithOffset(Block blockIn, int meta)` — Returns the direction-shifted metadata for blocks that require orientation, e.g. doors, stairs, ladders.
- `protected int getXWithOffset(int x, int z)`
- `protected int getYWithOffset(int y)`
- `protected int getZWithOffset(int x, int z)`
- `protected boolean isLiquidInStructureBoundingBox(World worldIn, StructureBoundingBox boundingboxIn)` — checks the entire StructureBoundingBox for Liquids
- `protected void placeDoorCurrentPosition(World worldIn, StructureBoundingBox boundingBoxIn, java.util.Random rand, int x, int y, int z, EnumFacing facing)` — Places door on given position
- `protected void randomlyPlaceBlock(World worldIn, StructureBoundingBox boundingboxIn, java.util.Random rand, float chance, int x, int y, int z, IBlockState blockstateIn)`
- `protected void randomlyRareFillWithBlocks(World worldIn, StructureBoundingBox boundingboxIn, int minX, int minY, int minZ, int maxX, int maxY, int maxZ, IBlockState blockstateIn, boolean p_180777_10_)`
- `void readStructureBaseNBT(World worldIn, NBTTagCompound tagCompound)` — Reads and sets structure base data (boundingbox, coordBase and componentType )
- `protected abstract void readStructureFromNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to read subclass data from NBT
- `protected void replaceAirAndLiquidDownwards(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)` — Replaces air and liquid from given position downwards.
- `protected void setBlockState(World worldIn, IBlockState blockstateIn, int x, int y, int z, StructureBoundingBox boundingboxIn)`
- `protected abstract void writeStructureToNBT(NBTTagCompound tagCompound)` — (abstract) Helper method to write subclass data to NBT

## Fields

- `protected StructureBoundingBox boundingBox`
- `protected int componentType` — The type ID of this component.
- `protected EnumFacing coordBaseMode` — switches the Coordinate System base off the Bounding Box
