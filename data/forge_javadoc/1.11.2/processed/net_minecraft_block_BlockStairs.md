# BlockStairs

## Class signature

```java
public class BlockStairs extends Block
```

## Constructors

- `protected BlockStairs( IBlockState modelState)`

## Methods

- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn, boolean p_185477_7_)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public int getPackedLightmapCoords( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public float getExplosionResistance( Entity exploder)`
- `public int tickRate( World worldIn)`
- `public Vec3d modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `public BlockRenderLayer getBlockLayer()`
- `public AxisAlignedBB getSelectedBoundingBox( IBlockState state, World worldIn, BlockPos pos)`
- `public boolean isCollidable()`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public void onEntityWalk( World worldIn, BlockPos pos, Entity entityIn)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public boolean isFullyOpaque( IBlockState state)`
- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `@Nullable public RayTraceResult collisionRayTrace( IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public static boolean isBlockStairs( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public boolean doesSideBlockRendering( IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)`

## Description

Check if the face of a block should block rendering.