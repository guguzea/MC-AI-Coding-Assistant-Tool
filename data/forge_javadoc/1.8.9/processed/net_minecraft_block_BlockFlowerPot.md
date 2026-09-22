# BlockFlowerPot

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockFlowerPot

## Class signature

```java
public class BlockFlowerPot extends BlockContainer
```

## Constructors

- `BlockFlowerPot()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `int colorMultiplier(IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected BlockState createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `int getDamageValue(World worldIn, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `void harvestBlock(World world, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `boolean isFlowerPot()` — Returns true only if block is flowerPot
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `boolean removedByPlayer(World world, BlockPos pos, EntityPlayer player, boolean willHarvest)` — Called when a player removes a block.
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item

## Fields

- `static PropertyEnum<BlockFlowerPot.EnumFlowerType> CONTENTS`
- `static PropertyInteger LEGACY_DATA`