# BlockSlab

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockSlab

## Class signature

```java
public abstract class BlockSlab extends Block
```

## Constructors

- `BlockSlab(Material materialIn)`
- `BlockSlab(Material p_i47249_1_, MapColor p_i47249_2_)`

## Methods

- `protected boolean canSilkHarvest()`
- `boolean doesSideBlockRendering(IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)` — Check if the face of a block should block rendering.
- `BlockFaceShape getBlockFaceShape(IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `abstract java.lang.Comparable<?> getTypeForItem(ItemStack stack)`
- `abstract java.lang.String getUnlocalizedName(int meta)`
- `abstract IProperty<?> getVariantProperty()`
- `abstract boolean isDouble()`
- `boolean isFullCube(IBlockState state)`
- `protected static boolean isHalfSlab(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isTopSolid(IBlockState state)`
- `int quantityDropped(java.util.Random random)`
- `boolean shouldSideBeRendered(IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`

## Fields

- `protected static AxisAlignedBB AABB_BOTTOM_HALF`
- `protected static AxisAlignedBB AABB_TOP_HALF`
- `static PropertyEnum<BlockSlab.EnumBlockHalf> HALF`