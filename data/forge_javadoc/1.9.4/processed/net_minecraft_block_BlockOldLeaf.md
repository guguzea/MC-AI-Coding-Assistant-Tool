# BlockOldLeaf

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLeaves → net.minecraft.block.BlockOldLeaf

## Class signature

```java
public class BlockOldLeaf extends BlockLeaves
```

## Constructors

- `BlockOldLeaf()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int damageDropped(IBlockState state)`
- `protected void dropApple(World worldIn, BlockPos pos, IBlockState state, int chance)`
- `int getMetaFromState(IBlockState state)`
- `protected int getSaplingDropChance(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)`
- `BlockPlanks.EnumType getWoodType(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.

## Fields

- `static PropertyEnum<BlockPlanks.EnumType> VARIANT`