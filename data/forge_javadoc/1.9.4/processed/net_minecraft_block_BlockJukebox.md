# BlockJukebox

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockJukebox

## Class signature

```java
public class BlockJukebox extends BlockContainer
```

## Constructors

- `BlockJukebox()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `void insertRecord(World worldIn, BlockPos pos, IBlockState state, ItemStack recordStack)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`

## Fields

- `static PropertyBool HAS_RECORD`