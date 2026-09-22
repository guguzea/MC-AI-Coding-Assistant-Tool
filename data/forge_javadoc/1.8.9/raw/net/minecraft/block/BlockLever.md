---
title: "BlockLever"
description: "public class BlockLever extends Block"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockLever.html"
sourceType: javadoc
---

# BlockLever

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockLever

## Class signature

```java
public class BlockLever extends Block
```

## Constructors

- `BlockLever()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)` — Check whether this Block can be placed on the given side
- `boolean canProvidePower()` — Can this block provide power.
- `protected BlockState createBlockState()`
- `protected static boolean func_181090_a(World p_181090_0_, BlockPos p_181090_1_, EnumFacing p_181090_2_)`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `static int getMetadataForFacing(EnumFacing facing)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `int getStrongPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `int getWeakPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`

## Fields

- `static PropertyEnum<BlockLever.EnumOrientation> FACING`
- `static PropertyBool POWERED`
