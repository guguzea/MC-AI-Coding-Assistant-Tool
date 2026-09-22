# BlockDeadBush

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockDeadBush

## Class signature

```java
public class BlockDeadBush extends BlockBush implements IShearable
```

## Methods

- `protected boolean canPlaceBlockOn(Block ground)` — is the block grass, dirt or farmland
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `boolean isReplaceable(World worldIn, BlockPos pos)` — Whether this Block can be replaced directly by other blocks (true for e.g. tall grass)
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.

## Fields

- `protected BlockDeadBush`