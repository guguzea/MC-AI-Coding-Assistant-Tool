# BlockDeadBush

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockDeadBush

## Class signature

```java
public class BlockDeadBush extends BlockBush implements IShearable
```

## Constructors

- `BlockDeadBush()`

## Methods

- `protected boolean canSustainBush(IBlockState state)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `MapColor getMapColor(IBlockState state)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isReplaceable(IBlockAccess worldIn, BlockPos pos)`
- `boolean isShearable(ItemStack item, IBlockAccess world, BlockPos pos)` — Checks if the object is currently shearable Example: Sheep return false when they have no wool
- `java.util.List<ItemStack> onSheared(ItemStack item, IBlockAccess world, BlockPos pos, int fortune)` — Performs the shear function on this object.
- `int quantityDropped(java.util.Random random)`

## Fields

- `protected static AxisAlignedBB DEAD_BUSH_AABB`