# BlockReed

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockReed

## Class signature

```java
public class BlockReed extends Block implements IPlantable
```

## Constructors

- `BlockReed()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean checkForDrop(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `AxisAlignedBB getCollisionBoundingBox(IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getPlant(IBlockAccess world, BlockPos pos)`
- `EnumPlantType getPlantType(IBlockAccess world, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`
- `protected static AxisAlignedBB REED_AABB`