---
title: "BlockBeacon"
description: "public class BlockBeacon extends BlockContainer"
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/BlockBeacon.html"
sourceType: javadoc
---

# BlockBeacon

## Class signature

```java
public class BlockBeacon extends BlockContainer
```

## Constructors

- `public BlockBeacon()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public BlockRenderLayer getBlockLayer()`
- `public static void updateColorAsync( World worldIn, BlockPos glassPos)`
