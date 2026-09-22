# BlockTripWire

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTripWire

## Class signature

```java
public class BlockTripWire extends Block
```

## Constructors

- `BlockTripWire()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `static boolean isConnectedTo(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing direction)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `void randomTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB AABB`
- `static PropertyBool ATTACHED`
- `static PropertyBool DISARMED`
- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool POWERED`
- `static PropertyBool SOUTH`
- `protected static AxisAlignedBB TRIP_WRITE_ATTACHED_AABB`
- `static PropertyBool WEST`