# BlockChorusFlower

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockChorusFlower

## Class signature

```java
public class BlockChorusFlower extends Block
```

## Constructors

- `BlockChorusFlower()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canSurvive(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `static void generatePlant(World worldIn, BlockPos pos, java.util.Random rand, int p_185603_3_)`
- `BlockRenderLayer getBlockLayer()`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `protected ItemStack getSilkTouchDrop(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void harvestBlock(World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`