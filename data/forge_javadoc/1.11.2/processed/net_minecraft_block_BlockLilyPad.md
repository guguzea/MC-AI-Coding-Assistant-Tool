# BlockLilyPad

## Class signature

```java
public class BlockLilyPad extends BlockBush
```

## Constructors

- `protected BlockLilyPad()`

## Methods

- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected boolean canSustainBush( IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public int getMetaFromState( IBlockState state)`