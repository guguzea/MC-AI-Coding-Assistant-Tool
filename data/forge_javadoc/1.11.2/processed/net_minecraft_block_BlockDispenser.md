# BlockDispenser

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockDispenser

## Class signature

```java
public class BlockDispenser extends BlockContainer
```

## Constructors

- `BlockDispenser()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `TileEntity createNewTileEntity(World worldIn, int meta)`
- `protected void dispense(World worldIn, BlockPos pos)`
- `protected IBehaviorDispenseItem getBehavior(ItemStack stack)`
- `int getComparatorInputOverride(IBlockState blockState, World worldIn, BlockPos pos)`
- `static IPosition getDispensePosition(IBlockSource coords)`
- `int getMetaFromState(IBlockState state)`
- `EnumBlockRenderType getRenderType(IBlockState state)`
- `IBlockState getStateForPlacement(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `IBlockState getStateFromMeta(int meta)`
- `boolean hasComparatorInputOverride(IBlockState state)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockPlacedBy(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `int tickRate(World worldIn)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static RegistryDefaulted<Item, IBehaviorDispenseItem> DISPENSE_BEHAVIOR_REGISTRY`
- `static PropertyDirection FACING`
- `protected java.util.Random rand`
- `static PropertyBool TRIGGERED`