# BlockCauldron

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockCauldron

## Class signature

```java
public class BlockCauldron extends Block
```

## Constructors

- `BlockCauldron()`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn, boolean p_185477_7_)`
- `protected BlockStateContainer createBlockState()`
- `void fillWithRain(World worldIn, BlockPos pos)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `void setWaterLevel(World worldIn, BlockPos pos, IBlockState state, int level)`

## Fields

- `protected static AxisAlignedBB AABB_LEGS`
- `protected static AxisAlignedBB AABB_WALL_EAST`
- `protected static AxisAlignedBB AABB_WALL_NORTH`
- `protected static AxisAlignedBB AABB_WALL_SOUTH`
- `protected static AxisAlignedBB AABB_WALL_WEST`
- `static PropertyInteger LEVEL`