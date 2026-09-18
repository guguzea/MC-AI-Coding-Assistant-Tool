# BlockEndGateway

## Class signature

```java
public class BlockEndGateway extends BlockContainer
```

## Constructors

- `protected BlockEndGateway( Material p_i46687_1_)`

## Methods

- `public TileEntity createNewTileEntity( World worldIn, int meta)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `@Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public MapColor getMapColor( IBlockState state)`