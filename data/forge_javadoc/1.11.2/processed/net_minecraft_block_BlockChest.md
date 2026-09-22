# BlockChest

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockChest

## Class signature

```java
public class BlockChest extends BlockContainer
```

## Constructors

- `BlockChest(BlockChest.Type chestTypeIn)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canProvidePower(IBlockState state)`
- `IBlockState checkForSurroundingChests(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState correctFacing(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `ILockableContainer getContainer(World p_189418_1_, BlockPos p_189418_2_, boolean p_189418_3_)`
- `ILockableContainer getLockableContainer(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `boolean hasCustomBreakingProgress(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `BlockChest.Type chestType`
- `protected static AxisAlignedBB EAST_CHEST_AABB`
- `static PropertyDirection FACING`
- `protected static AxisAlignedBB NORTH_CHEST_AABB`
- `protected static AxisAlignedBB NOT_CONNECTED_AABB`
- `protected static AxisAlignedBB SOUTH_CHEST_AABB`
- `protected static AxisAlignedBB WEST_CHEST_AABB`