# BlockRedstoneRepeater

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHorizontal → net.minecraft.block.BlockRedstoneDiode → net.minecraft.block.BlockRedstoneRepeater

## Class signature

```java
public class BlockRedstoneRepeater extends BlockRedstoneDiode
```

## Constructors

- `BlockRedstoneRepeater(boolean powered)`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `protected BlockStateContainer createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `protected int getDelay(IBlockState state)`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `java.lang.String getLocalizedName()`
- `int getMetaFromState(IBlockState state)`
- `protected IBlockState getPoweredState(IBlockState unpoweredState)`
- `IBlockState getStateFromMeta(int meta)`
- `protected IBlockState getUnpoweredState(IBlockState poweredState)`
- `protected boolean isAlternateInput(IBlockState state)`
- `boolean isLocked(IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void randomDisplayTick(IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyInteger DELAY`
- `static PropertyBool LOCKED`