# BlockQuartz

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockQuartz

## Class signature

```java
public class BlockQuartz extends Block
```

## Constructors

- `BlockQuartz()`

## Methods

- `protected BlockState createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.

## Fields

- `static PropertyEnum<BlockQuartz.EnumType> VARIANT`