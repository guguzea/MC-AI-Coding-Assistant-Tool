---
title: "BlockRedstoneDiode"
description: "public abstract class BlockRedstoneDiode extends BlockHorizontal"
package: "net/minecraft/block"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockRedstoneDiode.html"
sourceType: javadoc
---

# BlockRedstoneDiode

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockRedstoneDiode

## Class signature

```java
public abstract class BlockRedstoneDiode extends BlockHorizontal
```

## Constructors

- `BlockRedstoneDiode(boolean powered)`

## Methods

- `protected int calculateInputStrength(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canBlockStay(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canProvidePower(IBlockState state)`
- `protected int getActiveSignal(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected abstract int getDelay(IBlockState state)`
- `protected abstract IBlockState getPoweredState(IBlockState unpoweredState)`
- `protected int getPowerOnSide(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `protected int getPowerOnSides(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected int getTickDelay(IBlockState state)`
- `protected abstract IBlockState getUnpoweredState(IBlockState poweredState)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected boolean isAlternateInput(IBlockState state)`
- `boolean isAssociatedBlock(Block other)`
- `static boolean isDiode(IBlockState state)`
- `boolean isFacingTowardsRepeater(World worldIn, BlockPos pos, IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isLocked(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `protected boolean isPowered(IBlockState state)`
- `boolean isSameDiode(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `protected void notifyNeighbors(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `protected boolean shouldBePowered(World worldIn, BlockPos pos, IBlockState state)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `protected void updateState(World worldIn, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected boolean isRepeaterPowered`
- `protected static AxisAlignedBB REDSTONE_DIODE_AABB`
