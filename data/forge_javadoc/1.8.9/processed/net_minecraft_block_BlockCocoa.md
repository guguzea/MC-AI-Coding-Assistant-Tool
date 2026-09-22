# BlockCocoa

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDirectional → net.minecraft.block.BlockCocoa

## Class signature

```java
public class BlockCocoa extends BlockDirectional implements IGrowable
```

## Constructors

- `BlockCocoa()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)` — Whether this IGrowable can grow
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `protected BlockState createBlockState()`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getDamageValue(World worldIn, BlockPos pos)`
- `java.util.List<ItemStack> getDrops(IBlockAccess world, BlockPos pos, IBlockState state, int fortune)` — This returns a complete list of items dropped from this block.
- `Item getItem(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)` — Called by ItemBlocks after a block is set in the world, to allow post-place logic
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`