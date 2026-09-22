# BlockCommandBlock

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockCommandBlock

## Class signature

```java
public class BlockCommandBlock extends BlockContainer
```

## Constructors

- `BlockCommandBlock()`

## Methods

- `protected BlockState createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean hasComparatorInputOverride()`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)` — Called by ItemBlocks after a block is set in the world, to allow post-place logic
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool TRIGGERED`