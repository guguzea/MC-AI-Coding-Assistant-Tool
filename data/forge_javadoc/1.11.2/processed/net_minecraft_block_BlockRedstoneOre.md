# BlockRedstoneOre

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRedstoneOre

## Class signature

```java
public class BlockRedstoneOre extends Block
```

## Methods

- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `int getExpDrop(IBlockState state, IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `void onEntityWalk(World worldIn, BlockPos pos, Entity entityIn)`
- `int quantityDropped(java.util.Random random)`
- `int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `BlockRedstoneOre`