# BlockRedstoneWire

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRedstoneWire

## Class signature

```java
public class BlockRedstoneWire extends Block
```

## Constructors

- `BlockRedstoneWire()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected static boolean canConnectTo(IBlockState blockState, EnumFacing side, IBlockAccess world, BlockPos pos)`
- `protected static boolean canConnectUpwardsTo(IBlockAccess worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canProvidePower(IBlockState state)`
- `static int colorMultiplier(int p_176337_0_)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> EAST`
- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> NORTH`
- `static PropertyInteger POWER`
- `protected static AxisAlignedBB [] REDSTONE_WIRE_AABB`
- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> SOUTH`
- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> WEST`