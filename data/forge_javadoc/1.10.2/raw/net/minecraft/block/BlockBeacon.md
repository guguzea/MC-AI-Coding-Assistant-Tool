---
title: "BlockBeacon"
description: "public class BlockBeacon extends BlockContainer"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockBeacon.html"
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
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public BlockRenderLayer getBlockLayer()`
- `public static void updateColorAsync( World worldIn, BlockPos glassPos)`
