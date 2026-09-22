# BlockHugeMushroom

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockHugeMushroom

## Class signature

```java
public class BlockHugeMushroom extends Block
```

## Constructors

- `BlockHugeMushroom(Material p_i46392_1_, MapColor p_i46392_2_, Block p_i46392_3_)`

## Methods

- `protected BlockState createBlockState()`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.

## Fields

- `static PropertyEnum<BlockHugeMushroom.EnumType> VARIANT`