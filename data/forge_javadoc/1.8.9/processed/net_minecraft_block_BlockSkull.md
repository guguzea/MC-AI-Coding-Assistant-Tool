# BlockSkull

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockSkull

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
- `protected BlockState createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getDamageValue(World worldIn, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess worldIn, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected BlockPattern getWitherBasePattern()`
- `protected BlockPattern getWitherPattern()`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`

## Fields

- `static PropertyDirection FACING`
- `static PropertyBool NODROP`