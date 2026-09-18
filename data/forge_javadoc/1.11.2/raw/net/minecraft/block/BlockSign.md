---
title: "BlockSign"
description: "public class BlockSign extends BlockContainer"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockSign.html"
sourceType: javadoc
---

# BlockSign

## Class signature

```java
public class BlockSign extends BlockContainer
```

## Constructors

- `protected BlockSign()`

## Methods

- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean hasCustomBreakingProgress( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean canSpawnInBlock()`
- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
