# BlockButton

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockButton

## Class signature

```java
public abstract class BlockButton extends BlockDirectional
```

## Constructors

- `BlockButton(boolean wooden)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected static boolean canPlaceBlock(World worldIn, BlockPos pos, EnumFacing direction)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)`
- `boolean canProvidePower(IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `int getStrongPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `int getWeakPower(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `protected abstract void playClickSound(EntityPlayer player, World worldIn, BlockPos pos)`
- `protected abstract void playReleaseSound(World worldIn, BlockPos pos)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB AABB_DOWN_OFF`
- `protected static AxisAlignedBB AABB_DOWN_ON`
- `protected static AxisAlignedBB AABB_EAST_OFF`
- `protected static AxisAlignedBB AABB_EAST_ON`
- `protected static AxisAlignedBB AABB_NORTH_OFF`
- `protected static AxisAlignedBB AABB_NORTH_ON`
- `protected static AxisAlignedBB AABB_SOUTH_OFF`
- `protected static AxisAlignedBB AABB_SOUTH_ON`
- `protected static AxisAlignedBB AABB_UP_OFF`
- `protected static AxisAlignedBB AABB_UP_ON`
- `protected static AxisAlignedBB AABB_WEST_OFF`
- `protected static AxisAlignedBB AABB_WEST_ON`
- `static PropertyBool POWERED`