# BlockNewLeaf

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockLeavesBase → net.minecraft.block.BlockLeaves → net.minecraft.block.BlockNewLeaf

## Class signature

```java
public class BlockNewLeaf extends BlockLeaves
```

## Constructors

- `BlockNewLeaf()`

## Methods

- `protected BlockState createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `protected void dropApple(World worldIn, BlockPos pos, IBlockState state, int chance)`
- `int getDamageValue(World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `BlockPlanks.EnumType getWoodType(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.

## Fields

- `static PropertyEnum<BlockPlanks.EnumType> VARIANT`