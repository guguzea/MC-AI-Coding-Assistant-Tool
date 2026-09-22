---
title: "BlockLever"
description: "public class BlockLever extends Block"
package: "net/minecraft/block"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockLever.html"
sourceType: javadoc
---

# BlockLever

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLever

## Class signature

```java
public class BlockLever extends Block
```

## Constructors

- `BlockLever()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected static boolean canAttachTo(World p_181090_0_, BlockPos p_181090_1_, EnumFacing p_181090_2_)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `boolean canProvidePower(IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<BlockLever.EnumOrientation> FACING`
- `protected static AxisAlignedBB LEVER_DOWN_AABB`
- `protected static AxisAlignedBB LEVER_EAST_AABB`
- `protected static AxisAlignedBB LEVER_NORTH_AABB`
- `protected static AxisAlignedBB LEVER_SOUTH_AABB`
- `protected static AxisAlignedBB LEVER_UP_AABB`
- `protected static AxisAlignedBB LEVER_WEST_AABB`
- `static PropertyBool POWERED`
