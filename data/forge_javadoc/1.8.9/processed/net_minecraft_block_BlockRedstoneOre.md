# BlockRedstoneOre

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRedstoneOre

## Class signature

```java
public class BlockRedstoneOre extends Block
```

## Methods

- `protected ItemStack createStackedBlock(IBlockState state)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `int getExpDrop(IBlockAccess world, BlockPos pos, int fortune)` — Gathers how much experience this block drops when broken.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, Entity entityIn)` — Triggered whenever an entity collides with this block (enters into the block)
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `int quantityDroppedWithBonus(int fortune, java.util.Random random)` — Get the quantity dropped based on the given fortune level
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `BlockRedstoneOre`