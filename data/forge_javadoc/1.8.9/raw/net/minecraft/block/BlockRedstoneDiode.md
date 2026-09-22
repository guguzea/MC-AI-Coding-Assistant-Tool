---
title: "BlockRedstoneDiode"
description: "public abstract class BlockRedstoneDiode extends BlockDirectional"
package: "net/minecraft/block"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockRedstoneDiode.html"
sourceType: javadoc
---

# BlockRedstoneDiode

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockRedstoneDiode

## Class signature

```java
public abstract class BlockRedstoneDiode extends BlockDirectional
```

## Constructors

- `BlockRedstoneDiode(boolean powered)`

## Methods

- `protected int calculateInputStrength(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canBlockStay(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean canPowerSide(Block blockIn)`
- `boolean canProvidePower()` — Can this block provide power.
- `protected int getActiveSignal(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `EnumWorldBlockLayer getBlockLayer()`
- `protected abstract int getDelay(IBlockState state)`
- `protected abstract IBlockState getPoweredState(IBlockState unpoweredState)`
- `protected int getPowerOnSide(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `protected int getPowerOnSides(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `int getStrongPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `protected int getTickDelay(IBlockState state)`
- `protected abstract IBlockState getUnpoweredState(IBlockState poweredState)`
- `int getWeakPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `boolean isAssociated(Block other)`
- `boolean isAssociatedBlock(Block other)`
- `boolean isFacingTowardsRepeater(World worldIn, BlockPos pos, IBlockState state)`
- `boolean isFullCube()`
- `boolean isLocked(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `protected boolean isPowered(IBlockState state)`
- `static boolean isRedstoneRepeaterBlockID(Block blockIn)`
- `protected void notifyNeighbors(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)` — Called when a player destroys this Block
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)` — Called by ItemBlocks after a block is set in the world, to allow post-place logic
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)` — Called randomly when setTickRandomly is set to true (used by e.g. crops to grow, etc.)
- `protected boolean shouldBePowered(World worldIn, BlockPos pos, IBlockState state)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `protected void updateState(World worldIn, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected boolean isRepeaterPowered` — Tells whether the repeater is powered or not
