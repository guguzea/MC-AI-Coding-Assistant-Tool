---
title: "BlockTrapDoor"
description: "public class BlockTrapDoor extends Block"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockTrapDoor.html"
sourceType: javadoc
---

# BlockTrapDoor

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTrapDoor

## Class signature

```java
public class BlockTrapDoor extends Block
```

## Constructors

- `BlockTrapDoor(Material materialIn)`

## Methods

- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `protected BlockStateContainer createBlockState()`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected static EnumFacing getFacing(int meta)`
- `protected static int getMetaForFacing(EnumFacing facing)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isLadder(IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)` — Checks if a player or entity can use this block to 'climb' like a ladder.
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `protected void playSound(EntityPlayer player, World worldIn, BlockPos pos, boolean p_185731_4_)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB BOTTOM_AABB`
- `protected static AxisAlignedBB EAST_OPEN_AABB`
- `static PropertyDirection FACING`
- `static PropertyEnum<BlockTrapDoor.DoorHalf> HALF`
- `protected static AxisAlignedBB NORTH_OPEN_AABB`
- `static PropertyBool OPEN`
- `protected static AxisAlignedBB SOUTH_OPEN_AABB`
- `protected static AxisAlignedBB TOP_AABB`
- `protected static AxisAlignedBB WEST_OPEN_AABB`
