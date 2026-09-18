# BlockFluidBase

## Class signature

```java
public abstract class BlockFluidBase extends Block implements IFluidBlock
```

## Constructors

- `public BlockFluidBase( Fluid fluid, Material material)`

## Methods

- `protected BlockState createBlockState()`
- `public int getMetaFromState( IBlockState state)`
- `public BlockFluidBase setQuantaPerBlock(int quantaPerBlock)`
- `public BlockFluidBase setDensity(int density)`
- `public BlockFluidBase setTemperature(int temperature)`
- `public BlockFluidBase setTickRate(int tickRate)`
- `public BlockFluidBase setRenderLayer( EnumWorldBlockLayer renderLayer)`
- `public BlockFluidBase setMaxScaledLight(int maxScaledLight)`
- `public boolean canDisplace( IBlockAccess world, BlockPos pos)`
- `public boolean displaceIfPossible( World world, BlockPos pos)`
- `public abstract int getQuantaValue( IBlockAccess world, BlockPos pos)`
- `public abstract boolean canCollideCheck( IBlockState state, boolean fullHit)`
- `public abstract int getMaxRenderHeightMeta()`
- `public void onBlockAdded( World world, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World world, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean requiresUpdates()`
- `public boolean isPassable( IBlockAccess world, BlockPos pos)`
- `public AxisAlignedBB getCollisionBoundingBox( World world, BlockPos pos, IBlockState state)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random par1Random)`
- `public int tickRate( World world)`
- `public Vec3 modifyAcceleration( World world, BlockPos pos, Entity entity, Vec3 vec)`
- `public int getLightValue( IBlockAccess world, BlockPos pos)`
- `public boolean isOpaqueCube()`
- `public boolean isFullCube()`
- `public int getMixedBrightnessForBlock( IBlockAccess world, BlockPos pos)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public boolean shouldSideBeRendered( IBlockAccess world, BlockPos pos, EnumFacing side)`
- `public IBlockState getExtendedState( IBlockState oldState, IBlockAccess worldIn, BlockPos pos)`
- `public static final int getDensity( IBlockAccess world, BlockPos pos)`
- `public static final int getTemperature( IBlockAccess world, BlockPos pos)`
- `public static double getFlowDirection( IBlockAccess world, BlockPos pos)`
- `public final int getQuantaValueBelow( IBlockAccess world, BlockPos pos, int belowThis)`
- `public final int getQuantaValueAbove( IBlockAccess world, BlockPos pos, int aboveThis)`
- `public final float getQuantaPercentage( IBlockAccess world, BlockPos pos)`
- `public float getFluidHeightAverage(float... flow)`
- `public float getFluidHeightForRender( IBlockAccess world, BlockPos pos)`
- `public Vec3 getFlowVector( IBlockAccess world, BlockPos pos)`
- `public Fluid getFluid()`
- `public float getFilledPercentage( World world, BlockPos pos)`

## Description

This is a base implementation for Fluid blocks. It is highly recommended that you extend this class or one of the Forge-provided child classes.