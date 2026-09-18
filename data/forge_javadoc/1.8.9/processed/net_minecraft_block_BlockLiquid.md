# BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Constructors

- `protected BlockLiquid( Material materialIn)`

## Methods

- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public static float getLiquidHeightPercent(int meta)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected int getLevel( IBlockAccess worldIn, BlockPos pos)`
- `protected int getEffectiveFlowDecay( IBlockAccess worldIn, BlockPos pos)`
- `public boolean isFullCube()`
- `public boolean isOpaqueCube()`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean isBlockSolid( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean func_176364_g( IBlockAccess blockAccess, BlockPos pos)`
- `public int getRenderType()`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public int quantityDropped(java.util.Random random)`
- `protected Vec3 getFlowVector( IBlockAccess worldIn, BlockPos pos)`
- `public Vec3 modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3 motion)`
- `public int tickRate( World worldIn)`
- `public int getMixedBrightnessForBlock( IBlockAccess worldIn, BlockPos pos)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public static double getFlowDirection( IBlockAccess worldIn, BlockPos pos, Material materialIn)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public boolean checkForMixing( World worldIn, BlockPos pos, IBlockState state)`
- `protected void triggerMixEffects( World worldIn, BlockPos pos)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`
- `public static BlockDynamicLiquid getFlowingBlock( Material materialIn)`
- `public static BlockStaticLiquid getStaticBlock( Material materialIn)`

## Description

Get the Item that this Block should drop when harvested.