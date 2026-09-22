---
title: "BlockShulkerBox"
description: "public class BlockShulkerBox extends BlockContainer"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockShulkerBox.html"
sourceType: javadoc
---

# BlockShulkerBox

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockShulkerBox

## Class signature

```java
public class BlockShulkerBox extends BlockContainer
```

## Constructors

- `BlockShulkerBox(EnumDyeColor colorIn)`

## Methods

- `void addInformation(ItemStack stack, World player, java.util.List<java.lang.String> tooltip, ITooltipFlag advanced)`
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean causesSuffocation(IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `static Block getBlockByColor(EnumDyeColor colorIn)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `EnumDyeColor getColor()`
- `static ItemStack getColoredItemStack(EnumDyeColor colorIn)`
- `static EnumDyeColor getColorFromBlock(Block blockIn)`
- `static EnumDyeColor getColorFromItem(Item itemIn)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `EnumPushReaction getMobilityFlag(IBlockState state)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `boolean hasCustomBreakingProgress(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<EnumFacing> FACING`
