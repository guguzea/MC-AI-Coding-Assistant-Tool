# BlockFire

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFire

## Class signature

```java
public class BlockFire extends Block
```

## Constructors

- `BlockFire()`

## Methods

- `@Deprecated boolean canCatchFire(IBlockAccess worldIn, BlockPos pos)`
- `boolean canCatchFire(IBlockAccess world, BlockPos pos, EnumFacing face)` — Side sensitive version that calls the block function.
- `protected boolean canDie(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated int getEncouragement(Block blockIn)`
- `@Deprecated int getFlammability(Block blockIn)`
- `MapColor getMapColor(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `static void init()`
- `boolean isCollidable()`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `int quantityDropped(java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `boolean requiresUpdates()`
- `void setFireInfo(Block blockIn, int encouragement, int flammability)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`
- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool SOUTH`
- `static PropertyBool UPPER`
- `static PropertyBool WEST`