# BlockStairs

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockStairs

## Class signature

```java
public class BlockStairs extends Block
```

## Constructors

- `BlockStairs(IBlockState modelState)`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean p_185477_7_)`
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `RayTraceResult collisionRayTrace(IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `protected BlockStateContainer createBlockState()`
- `boolean doesSideBlockRendering(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)` — Check if the face of a block should block rendering.
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockRenderLayer getBlockLayer()`
- `float getExplosionResistance(Entity exploder)`
- `MapColor getMapColor(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `int getPackedLightmapCoords(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getSelectedBoundingBox(IBlockState state, World worldIn, BlockPos pos)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `static boolean isBlockStairs(IBlockState state)`
- `boolean isCollidable()`
- `boolean isFullCube(IBlockState state)`
- `boolean isFullyOpaque(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `Vec3d modifyAcceleration(World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `void onBlockDestroyedByExplosion(World worldIn, BlockPos pos, Explosion explosionIn)`
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)`
- `void onEntityWalk(World worldIn, BlockPos pos, Entity entityIn)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB AABB_OCT_BOT_NE`
- `protected static AxisAlignedBB AABB_OCT_BOT_NW`
- `protected static AxisAlignedBB AABB_OCT_BOT_SE`
- `protected static AxisAlignedBB AABB_OCT_BOT_SW`
- `protected static AxisAlignedBB AABB_OCT_TOP_NE`
- `protected static AxisAlignedBB AABB_OCT_TOP_NW`
- `protected static AxisAlignedBB AABB_OCT_TOP_SE`
- `protected static AxisAlignedBB AABB_OCT_TOP_SW`
- `protected static AxisAlignedBB AABB_QTR_BOT_EAST`
- `protected static AxisAlignedBB AABB_QTR_BOT_NORTH`
- `protected static AxisAlignedBB AABB_QTR_BOT_SOUTH`
- `protected static AxisAlignedBB AABB_QTR_BOT_WEST`
- `protected static AxisAlignedBB AABB_QTR_TOP_EAST`
- `protected static AxisAlignedBB AABB_QTR_TOP_NORTH`
- `protected static AxisAlignedBB AABB_QTR_TOP_SOUTH`
- `protected static AxisAlignedBB AABB_QTR_TOP_WEST`
- `protected static AxisAlignedBB AABB_SLAB_BOTTOM`
- `protected static AxisAlignedBB AABB_SLAB_TOP`
- `static PropertyDirection FACING`
- `static PropertyEnum<BlockStairs.EnumHalf> HALF`
- `static PropertyEnum<BlockStairs.EnumShape> SHAPE`