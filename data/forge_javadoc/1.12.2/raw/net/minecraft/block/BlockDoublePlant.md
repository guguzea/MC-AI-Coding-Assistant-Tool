---
title: "BlockDoublePlant"
description: "public class BlockDoublePlant extends BlockBush implements IGrowable, IShearable"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockDoublePlant.html"
sourceType: javadoc
---

# BlockDoublePlant

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockDoublePlant

## Class signature

```java
public class BlockDoublePlant extends BlockBush implements IGrowable, IShearable
```

## Constructors

- `BlockDoublePlant()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected void checkAndDropBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `Block.EnumOffsetType getOffsetType()`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(CreativeTabs itemIn, NonNullList<ItemStack> items)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isReplaceable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `void placeAt(World worldIn, BlockPos lowerPos, BlockDoublePlant.EnumPlantType variant, int flags)`

## Fields

- `static PropertyEnum<EnumFacing> FACING`
- `static PropertyEnum<BlockDoublePlant.EnumBlockHalf> HALF`
- `static PropertyEnum<BlockDoublePlant.EnumPlantType> VARIANT`
