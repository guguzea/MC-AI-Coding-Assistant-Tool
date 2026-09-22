---
title: "BlockChorusFlower"
description: "public class BlockChorusFlower extends Block"
package: "net/minecraft/block"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockChorusFlower.html"
sourceType: javadoc
---

# BlockChorusFlower

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockChorusFlower

## Class signature

```java
public class BlockChorusFlower extends Block
```

## Constructors

- `BlockChorusFlower()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canSurvive(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `static void generatePlant(World worldIn, BlockPos pos, java.util.Random rand, int p_185603_3_)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`
