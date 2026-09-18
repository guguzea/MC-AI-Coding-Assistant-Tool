---
title: "BlockCommandBlock"
description: "public class BlockCommandBlock extends BlockContainer"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockCommandBlock.html"
sourceType: javadoc
---

# BlockCommandBlock

## Class signature

```java
public class BlockCommandBlock extends BlockContainer
```

## Constructors

- `public BlockCommandBlock( MapColor color)`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean isNextToSuccessfulCommandBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int tickRate( World worldIn)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean hasComparatorInputOverride( IBlockState state)`
- `public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public int quantityDropped(java.util.Random random)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void propagateUpdate( World worldIn, BlockPos pos)`
