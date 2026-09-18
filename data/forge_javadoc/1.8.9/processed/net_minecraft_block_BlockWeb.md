# BlockWeb

## Class signature

```java
public class BlockWeb extends Block
```

## Constructors

- `public BlockWeb()`

## Methods

- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean isOpaqueCube()`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isFullCube()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `protected boolean canSilkHarvest()`
- `public EnumWorldBlockLayer getBlockLayer()`

## Description

Get the Item that this Block should drop when harvested.