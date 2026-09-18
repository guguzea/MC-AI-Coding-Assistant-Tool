# BlockTorch

## Class signature

```java
public class BlockTorch extends Block
```

## Constructors

- `protected BlockTorch()`

## Methods

- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `protected boolean onNeighborChangeInternal( World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean checkForDrop( World worldIn, BlockPos pos, IBlockState state)`
- `public MovingObjectPosition collisionRayTrace( World worldIn, BlockPos pos, Vec3 start, Vec3 end)`
- `public IBlockState getStateFromMeta(int meta)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public int getMetaFromState( IBlockState state)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `protected BlockState createBlockState()`

## Description

Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.