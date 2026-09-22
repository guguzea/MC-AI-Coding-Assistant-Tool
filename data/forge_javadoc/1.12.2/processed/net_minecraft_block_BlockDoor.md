# BlockDoor

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockDoor

## Class signature

```java
public class BlockDoor extends Block
```

## Constructors

- `BlockDoor(Material materialIn)`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `static int combineMetadata(IBlockAccess worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `static EnumFacing getFacing(IBlockAccess worldIn, BlockPos pos)`
- `static EnumFacing getFacing(int combinedMeta)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `MapColor getMapColor(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `EnumPushReaction getMobilityFlag(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `static boolean isOpen(IBlockAccess worldIn, BlockPos pos)`
- `protected static boolean isOpen(int combinedMeta)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `protected static boolean isTop(int meta)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `protected static int removeHalfBit(int meta)`
- `void toggleDoor(World worldIn, BlockPos pos, boolean open)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB EAST_AABB`
- `static PropertyDirection FACING`
- `static PropertyEnum<BlockDoor.EnumDoorHalf> HALF`
- `static PropertyEnum<BlockDoor.EnumHingePosition> HINGE`
- `protected static AxisAlignedBB NORTH_AABB`
- `static PropertyBool OPEN`
- `static PropertyBool POWERED`
- `protected static AxisAlignedBB SOUTH_AABB`
- `protected static AxisAlignedBB WEST_AABB`