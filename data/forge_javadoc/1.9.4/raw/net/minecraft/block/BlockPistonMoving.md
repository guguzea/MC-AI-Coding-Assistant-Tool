---
title: "BlockPistonMoving"
description: "public class BlockPistonMoving extends BlockContainer"
package: "net/minecraft/block"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockPistonMoving.html"
sourceType: javadoc
---

# BlockPistonMoving

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockPistonMoving

## Class signature

```java
public class BlockPistonMoving extends BlockContainer
```

## Constructors

- `BlockPistonMoving()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `RayTraceResult collisionRayTrace(IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `static TileEntity createTilePiston(IBlockState blockStateIn, EnumFacing facingIn, boolean extendingIn, boolean shouldHeadBeRenderedIn)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyDirection FACING`
- `static PropertyEnum<BlockPistonExtension.EnumPistonType> TYPE`
