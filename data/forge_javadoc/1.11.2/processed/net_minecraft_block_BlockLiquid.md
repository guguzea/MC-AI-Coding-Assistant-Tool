# BlockLiquid

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Constructors

- `BlockLiquid(Material materialIn)`

## Methods

- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `boolean checkForMixing(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `BlockRenderLayer getBlockLayer()`
- `static float getBlockLiquidHeight(IBlockState p_190973_0_, IBlockAccess p_190973_1_, BlockPos p_190973_2_)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `protected int getDepth(IBlockState p_189542_1_)`
- `protected Vec3d getFlow(IBlockAccess p_189543_1_, BlockPos p_189543_2_, IBlockState p_189543_3_)`
- `static BlockDynamicLiquid getFlowingBlock(Material materialIn)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `static float getLiquidHeight(IBlockState p_190972_0_, IBlockAccess p_190972_1_, BlockPos p_190972_2_)`
- `static float getLiquidHeightPercent(int meta)`
- `int getMetaFromState(IBlockState state)`
- `int getPackedLightmapCoords(IBlockState state, IBlockAccess source, BlockPos pos)`
- `protected int getRenderedDepth(IBlockState p_189545_1_)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `static float getSlopeAngle(IBlockAccess p_189544_0_, BlockPos p_189544_1_, Material p_189544_2_, IBlockState p_189544_3_)`
- `IBlockState getStateFromMeta(int meta)`
- `static BlockStaticLiquid getStaticBlock(Material materialIn)`
- `boolean isBlockSolid(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `Vec3d modifyAcceleration(World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `boolean shouldRenderSides(IBlockAccess blockAccess, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int tickRate(World worldIn)`
- `protected void triggerMixEffects(World worldIn, BlockPos pos)`

## Fields

- `static PropertyInteger LEVEL`