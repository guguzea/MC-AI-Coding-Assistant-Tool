---
title: "BlockEndPortal"
description: "public class BlockEndPortal extends BlockContainer"
package: "net/minecraft/block"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/BlockEndPortal.html"
sourceType: javadoc
---

# BlockEndPortal

## Class signature

```java
public class BlockEndPortal extends BlockContainer
```

## Constructors

- `protected BlockEndPortal( Material materialIn)`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `@Nullable public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public MapColor getMapColor( IBlockState state)`
