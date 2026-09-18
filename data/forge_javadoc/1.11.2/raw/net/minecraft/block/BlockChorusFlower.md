---
title: "BlockChorusFlower"
description: "public class BlockChorusFlower extends Block"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockChorusFlower.html"
sourceType: javadoc
---

# BlockChorusFlower

## Class signature

```java
public class BlockChorusFlower extends Block
```

## Constructors

- `protected BlockChorusFlower()`

## Methods

- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public boolean canSurvive( World worldIn, BlockPos pos)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, ItemStack stack)`
- `protected ItemStack getSilkTouchDrop( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public static void generatePlant( World worldIn, BlockPos pos, java.util.Random rand, int p_185603_3_)`
