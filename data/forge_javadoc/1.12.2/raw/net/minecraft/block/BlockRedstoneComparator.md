---
title: "BlockRedstoneComparator"
description: "public class BlockRedstoneComparator extends BlockRedstoneDiode implements ITileEntityProvider"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockRedstoneComparator.html"
sourceType: javadoc
---

# BlockRedstoneComparator

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockRedstoneDiode → net.minecraft.block.BlockRedstoneComparator

## Class signature

```java
public class BlockRedstoneComparator extends BlockRedstoneDiode implements ITileEntityProvider
```

## Constructors

- `BlockRedstoneComparator(boolean powered)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected int calculateInputStrength(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `boolean eventReceived(IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `protected int getActiveSignal(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected int getDelay(IBlockState state)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `int getMetaFromState(IBlockState state)`
- `protected IBlockState getPoweredState(IBlockState unpoweredState)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `protected IBlockState getUnpoweredState(IBlockState poweredState)`
- `boolean getWeakChanges(IBlockAccess world, BlockPos pos)` — If this block should be notified of weak changes.
- `protected boolean isPowered(IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onNeighborChange(IBlockAccess world, BlockPos pos, BlockPos neighbor)` — Called when a tile entity on a side of this block changes is created or is destroyed.
- `protected boolean shouldBePowered(World worldIn, BlockPos pos, IBlockState state)`
- `protected void updateState(World worldIn, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<BlockRedstoneComparator.Mode> MODE`
- `static PropertyBool POWERED`
