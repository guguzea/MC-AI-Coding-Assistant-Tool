---
title: "BlockTNT"
description: "Return whether this block can drop from an explosion."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockTNT.html"
sourceType: javadoc
---

# BlockTNT

## Class signature

```java
public class BlockTNT extends Block
```

## Constructors

- `public BlockTNT()`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public void explode( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase igniter)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean canDropFromExplosion( Explosion explosionIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Return whether this block can drop from an explosion.
