# BlockBasePressurePlate

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBasePressurePlate

## Class signature

```java
public abstract class BlockBasePressurePlate extends Block
```

## Constructors

- `BlockBasePressurePlate(Material materialIn)`
- `BlockBasePressurePlate(Material materialIn, MapColor mapColorIn)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canProvidePower(IBlockState state)`
- `boolean canSpawnInBlock()`
- `protected abstract int computeRedstoneStrength(World worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `EnumPushReaction getMobilityFlag(IBlockState state)`
- `protected abstract int getRedstoneStrength(IBlockState state)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `protected abstract void playClickOffSound(World worldIn, BlockPos pos)`
- `protected abstract void playClickOnSound(World worldIn, BlockPos color)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `protected abstract IBlockState setRedstoneStrength(IBlockState state, int strength)`
- `int tickRate(World worldIn)`
- `protected void updateNeighbors(World worldIn, BlockPos pos)`
- `protected void updateState(World worldIn, BlockPos pos, IBlockState state, int oldRedstoneStrength)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected static AxisAlignedBB PRESSED_AABB`
- `protected static AxisAlignedBB PRESSURE_AABB`
- `protected static AxisAlignedBB UNPRESSED_AABB`