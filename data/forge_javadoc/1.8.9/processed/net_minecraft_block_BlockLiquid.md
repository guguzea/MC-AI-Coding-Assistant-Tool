# BlockLiquid

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Constructors

- `BlockLiquid(Material materialIn)`

## Methods

- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `boolean checkForMixing(World worldIn, BlockPos pos, IBlockState state)`
- `int colorMultiplier(IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected BlockState createBlockState()`
- `boolean func_176364_g(IBlockAccess blockAccess, BlockPos pos)`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `protected int getEffectiveFlowDecay(IBlockAccess worldIn, BlockPos pos)`
- `static double getFlowDirection(IBlockAccess worldIn, BlockPos pos, Material materialIn)`
- `static BlockDynamicLiquid getFlowingBlock(Material materialIn)`
- `protected Vec3 getFlowVector(IBlockAccess worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `protected int getLevel(IBlockAccess worldIn, BlockPos pos)`
- `static float getLiquidHeightPercent(int meta)` — Returns the percentage of the liquid block that is air, based on the given flow decay of the liquid
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getMixedBrightnessForBlock(IBlockAccess worldIn, BlockPos pos)`
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `static BlockStaticLiquid getStaticBlock(Material materialIn)`
- `boolean isBlockSolid(IBlockAccess worldIn, BlockPos pos, EnumFacing side)` — Whether this Block is solid on the given Side
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `Vec3 modifyAcceleration(World worldIn, BlockPos pos, Entity entityIn, Vec3 motion)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `protected void triggerMixEffects(World worldIn, BlockPos pos)`

## Fields

- `static PropertyInteger LEVEL`