# BlockFence

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockFence

## Class signature

```java
public class BlockFence extends Block
```

## Constructors

- `BlockFence(Material materialIn, MapColor mapColorIn)`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean isActualState)`
- `boolean canBeConnectedTo(IBlockAccess world, BlockPos pos, EnumFacing facing)` — Determines if another block can connect to this block
- `boolean canConnectTo(IBlockAccess worldIn, BlockPos pos, EnumFacing facing)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `protected static boolean isExcepBlockForAttachWithPiston(Block p_194142_0_)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB [] BOUNDING_BOXES`
- `static PropertyBool EAST`
- `static AxisAlignedBB EAST_AABB`
- `static PropertyBool NORTH`
- `static AxisAlignedBB NORTH_AABB`
- `static AxisAlignedBB PILLAR_AABB`
- `static PropertyBool SOUTH`
- `static AxisAlignedBB SOUTH_AABB`
- `static PropertyBool WEST`
- `static AxisAlignedBB WEST_AABB`