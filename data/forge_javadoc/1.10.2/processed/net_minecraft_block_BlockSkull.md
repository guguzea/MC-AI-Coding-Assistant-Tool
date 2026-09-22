# BlockSkull

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockSkull

## Class signature

```java
public class BlockSkull extends BlockContainer
```

## Constructors

- `BlockSkull()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canDispenserPlace(World worldIn, BlockPos pos, ItemStack stack)`
- `void checkWitherSpawn(World worldIn, BlockPos pos, TileEntitySkull te)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess worldIn, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `protected BlockPattern getWitherBasePattern()`
- `protected BlockPattern getWitherPattern()`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB DEFAULT_AABB`
- `protected static AxisAlignedBB EAST_AABB`
- `static PropertyDirection FACING`
- `static PropertyBool NODROP`
- `protected static AxisAlignedBB NORTH_AABB`
- `protected static AxisAlignedBB SOUTH_AABB`
- `protected static AxisAlignedBB WEST_AABB`