# BlockLilyPad

## Class signature

```java
public class BlockLilyPad extends BlockBush
```

## Constructors

- `protected BlockLilyPad()`

## Methods

- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public int getBlockColor()`
- `public int getRenderColor( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected boolean canPlaceBlockOn( Block ground)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public int getMetaFromState( IBlockState state)`

## Description

Add all collision boxes of this Block to the list that intersect with the given mask.