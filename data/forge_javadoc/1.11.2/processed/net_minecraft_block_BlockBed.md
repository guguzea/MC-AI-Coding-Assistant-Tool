# BlockBed

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockBed

## Class signature

```java
public class BlockBed extends BlockHorizontal
```

## Constructors

- `BlockBed()`

## Methods

- `protected BlockStateContainer createBlockState()`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `BlockRenderLayer getBlockLayer()`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `int getMetaFromState(IBlockState state)`
- `EnumPushReaction getMobilityFlag(IBlockState state)`
- `static BlockPos getSafeExitLocation(World worldIn, BlockPos pos, int tries)`
- `IBlockState getStateFromMeta(int meta)`
- `protected static boolean hasRoomForPlayer(World worldIn, BlockPos pos)`
- `boolean isFullCube(IBlockState state)`
- `boolean isOpaqueCube(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `protected static AxisAlignedBB BED_AABB`
- `static PropertyBool OCCUPIED`
- `static PropertyEnum<BlockBed.EnumPartType> PART`