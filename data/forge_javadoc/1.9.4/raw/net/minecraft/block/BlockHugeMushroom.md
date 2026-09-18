---
title: "BlockHugeMushroom"
description: "Rotate the block."
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/BlockHugeMushroom.html"
sourceType: javadoc
---

# BlockHugeMushroom

## Class signature

```java
public class BlockHugeMushroom extends Block
```

## Constructors

- `public BlockHugeMushroom( Material materialIn, MapColor color, Block smallBlockIn)`

## Methods

- `public int quantityDropped(java.util.Random random)`
- `public MapColor getMapColor( IBlockState state)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public boolean rotateBlock( World world, BlockPos pos, EnumFacing axis)`

## Description

Rotate the block.
