---
title: "BlockBed"
description: "public class BlockBed extends BlockHorizontal"
package: "net/minecraft/block"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/block/BlockBed.html"
sourceType: javadoc
---

# BlockBed

## Class signature

```java
public class BlockBed extends BlockHorizontal
```

## Constructors

- `public BlockBed()`

## Methods

- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Nullable public static BlockPos getSafeExitLocation( World worldIn, BlockPos pos, int tries)`
- `protected static boolean hasRoomForPlayer( World worldIn, BlockPos pos)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public EnumPushReaction getMobilityFlag( IBlockState state)`
- `public BlockRenderLayer getBlockLayer()`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`
