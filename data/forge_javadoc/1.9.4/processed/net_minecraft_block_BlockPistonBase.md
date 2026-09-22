# BlockPistonBase

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockPistonBase

## Class signature

```java
public class BlockPistonBase extends BlockDirectional
```

## Constructors

- `BlockPistonBase(boolean isSticky)`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn)`
- `static boolean canPush(IBlockState blockStateIn, World worldIn, BlockPos pos, EnumFacing facing, boolean destroyBlocks)`
- `protected BlockStateContainer createBlockState()`
- `boolean eventReceived(IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `static EnumFacing getFacing(int meta)`
- `static EnumFacing getFacingFromEntity(BlockPos pos, EntityLivingBase p_185647_1_)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isFullyOpaque(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyBool EXTENDED`
- `protected static AxisAlignedBB PISTON_BASE_DOWN_AABB`
- `protected static AxisAlignedBB PISTON_BASE_EAST_AABB`
- `protected static AxisAlignedBB PISTON_BASE_NORTH_AABB`
- `protected static AxisAlignedBB PISTON_BASE_SOUTH_AABB`
- `protected static AxisAlignedBB PISTON_BASE_UP_AABB`
- `protected static AxisAlignedBB PISTON_BASE_WEST_AABB`