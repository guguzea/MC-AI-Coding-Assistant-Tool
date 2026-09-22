# BlockCake

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockCake

## Class signature

```java
public class BlockCake extends Block
```

## Constructors

- `BlockCake()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean hasComparatorInputOverride()`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item

## Fields

- `static PropertyInteger BITES`