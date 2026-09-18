---
title: "BlockStairs"
description: "Add all collision boxes of this Block to the list that intersect with the given mask."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/BlockStairs.html"
sourceType: javadoc
---

# BlockStairs

## Class signature

```java
public class BlockStairs extends Block
```

## Constructors

- `protected BlockStairs( IBlockState modelState)`

## Methods

- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube()`
- `public boolean doesSideBlockRendering( IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public boolean isFullCube()`
- `public void setBaseCollisionBounds( IBlockAccess worldIn, BlockPos pos)`
- `public static boolean isBlockStairs( Block blockIn)`
- `public static boolean isSameStair( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `public int func_176307_f( IBlockAccess blockAccess, BlockPos pos)`
- `public int func_176305_g( IBlockAccess blockAccess, BlockPos pos)`
- `public boolean func_176306_h( IBlockAccess blockAccess, BlockPos pos)`
- `public boolean func_176304_i( IBlockAccess blockAccess, BlockPos pos)`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public int getMixedBrightnessForBlock( IBlockAccess worldIn, BlockPos pos)`
- `public float getExplosionResistance( Entity exploder)`
- `public int tickRate( World worldIn)`
- `public Vec3 modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3 motion)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public boolean isCollidable()`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, Entity entityIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public MovingObjectPosition collisionRayTrace( World worldIn, BlockPos pos, Vec3 start, Vec3 end)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.
