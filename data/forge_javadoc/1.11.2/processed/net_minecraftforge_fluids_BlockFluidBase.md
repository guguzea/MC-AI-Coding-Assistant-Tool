# BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `public BlockFluidBase( Fluid fluid, Material material)`

## Methods

- `@Nonnull protected BlockStateContainer createBlockState()`
- `public int getMetaFromState(@Nonnull IBlockState state)`
- `@Deprecated @Nonnull public IBlockState getStateFromMeta(int meta)`
- `public BlockFluidBase setQuantaPerBlock(int quantaPerBlock)`
- `public BlockFluidBase setDensity(int density)`
- `public BlockFluidBase setTemperature(int temperature)`
- `public BlockFluidBase setTickRate(int tickRate)`
- `public BlockFluidBase setRenderLayer( BlockRenderLayer renderLayer)`
- `public BlockFluidBase setMaxScaledLight(int maxScaledLight)`
- `public boolean canDisplace( IBlockAccess world, BlockPos pos)`
- `public boolean displaceIfPossible( World world, BlockPos pos)`
- `public abstract int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public abstract boolean canCollideCheck(@Nonnull IBlockState state, boolean fullHit)`
- `public abstract int getMaxRenderHeightMeta()`
- `public void onBlockAdded(@Nonnull World world, @Nonnull BlockPos pos, @Nonnull IBlockState state)`
- `public void neighborChanged(@Nonnull IBlockState state, @Nonnull World world, @Nonnull BlockPos pos, @Nonnull Block neighborBlock, @Nonnull BlockPos neighbourPos)`
- `public boolean requiresUpdates()`
- `public boolean isPassable(@Nonnull IBlockAccess world, @Nonnull BlockPos pos)`
- `@Nonnull public Item getItemDropped(@Nonnull IBlockState state, @Nonnull java.util.Random rand, int fortune)`
- `public int quantityDropped(@Nonnull java.util.Random par1Random)`
- `public int tickRate(@Nonnull World world)`
- `@Nonnull public Vec3d modifyAcceleration(@Nonnull World world, @Nonnull BlockPos pos, @Nonnull Entity entity, @Nonnull Vec3d vec)`
- `public int getLightValue(@Nonnull IBlockState state, @Nonnull IBlockAccess world, @Nonnull BlockPos pos)`
- `public boolean isOpaqueCube(@Nonnull IBlockState state)`
- `public boolean isFullCube(@Nonnull IBlockState state)`
- `public int getPackedLightmapCoords(@Nonnull IBlockState state, @Nonnull IBlockAccess world, @Nonnull BlockPos pos)`
- `@Nonnull public BlockRenderLayer getBlockLayer()`
- `public boolean shouldSideBeRendered(@Nonnull IBlockState state, @Nonnull IBlockAccess world, @Nonnull BlockPos pos, @Nonnull EnumFacing side)`
- `@Nonnull public IBlockState getExtendedState(@Nonnull IBlockState oldState, @Nonnull IBlockAccess worldIn, @Nonnull BlockPos pos)`
- `public static final int getDensity( IBlockAccess world, BlockPos pos)`
- `public static final int getTemperature( IBlockAccess world, BlockPos pos)`
- `public static double getFlowDirection( IBlockAccess world, BlockPos pos)`
- `public final int getQuantaValueBelow( IBlockAccess world, BlockPos pos, int belowThis)`
- `public final int getQuantaValueAbove( IBlockAccess world, BlockPos pos, int aboveThis)`
- `public final float getQuantaPercentage( IBlockAccess world, BlockPos pos)`
- `public float getFluidHeightAverage(float... flow)`
- `public float getFluidHeightForRender( IBlockAccess world, BlockPos pos)`
- `public Vec3d getFlowVector( IBlockAccess world, BlockPos pos)`
- `public Fluid getFluid()`
- `public float getFilledPercentage( World world, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox(@Nonnull IBlockState blockState, @Nonnull IBlockAccess worldIn, @Nonnull BlockPos pos)`

## Description

This is a base implementation for Fluid blocks. It is highly recommended that you extend this class or one of the Forge-provided child classes.