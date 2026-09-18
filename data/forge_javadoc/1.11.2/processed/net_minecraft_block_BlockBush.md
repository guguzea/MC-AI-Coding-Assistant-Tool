# BlockBush

## Class signature

```java
public class BlockBush extends Block implements IPlantable
```

## Constructors

- `protected BlockBush()`
- `protected BlockBush( Material materialIn)`
- `protected BlockBush( Material materialIn, MapColor mapColorIn)`

## Methods

- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `protected boolean canSustainBush( IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `protected void checkAndDropBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean canBlockStay( World worldIn, BlockPos pos, IBlockState state)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public EnumPlantType getPlantType( IBlockAccess world, BlockPos pos)`
- `public IBlockState getPlant( IBlockAccess world, BlockPos pos)`
- `public BlockRenderLayer getBlockLayer()`