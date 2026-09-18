---
title: "BlockStructure"
description: "public class BlockStructure extends BlockContainer"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockStructure.html"
sourceType: javadoc
---

# BlockStructure

## Class signature

```java
public class BlockStructure extends BlockContainer
```

## Constructors

- `public BlockStructure()`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `@Nullable public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public EnumBlockRenderType getRenderType( IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
