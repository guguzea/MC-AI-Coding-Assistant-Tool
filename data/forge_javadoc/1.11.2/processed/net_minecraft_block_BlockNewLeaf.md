# BlockNewLeaf

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLeaves → net.minecraft.block.BlockNewLeaf

## Class signature

```java
public class BlockNewLeaf extends BlockLeaves
```

## Constructors

- `BlockNewLeaf()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `int damageDropped(IBlockState state)`
- `protected void dropApple(World worldIn, BlockPos pos, IBlockState state, int chance)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, NonNullList<ItemStack> list)`
- `BlockPlanks.EnumType getWoodType(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `NonNullList<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.

## Fields

- `static PropertyEnum<BlockPlanks.EnumType> VARIANT`