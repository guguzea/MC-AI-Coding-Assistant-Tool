# BlockLadder

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockLadder

## Class signature

```java
public class BlockLadder extends Block
```

## Constructors

- `BlockLadder()`

## Methods

- `protected boolean canBlockStay(World worldIn, BlockPos pos, EnumFacing facing)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean isFullCube(IBlockState state)`
- `boolean isLadder(IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)` — Checks if a player or entity can use this block to 'climb' like a ladder.
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyDirection FACING`
- `protected static AxisAlignedBB LADDER_EAST_AABB`
- `protected static AxisAlignedBB LADDER_NORTH_AABB`
- `protected static AxisAlignedBB LADDER_SOUTH_AABB`
- `protected static AxisAlignedBB LADDER_WEST_AABB`