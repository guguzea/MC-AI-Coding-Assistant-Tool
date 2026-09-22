# BlockRailPowered

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRailPowered

## Class signature

```java
public class BlockRailPowered extends BlockRailBase
```

## Constructors

- `BlockRailPowered()`
- `BlockRailPowered(boolean isActivator)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `protected boolean findPoweredRailSignal(World worldIn, BlockPos pos, IBlockState state, boolean p_176566_4_, int p_176566_5_)`
- `int getMetaFromState(IBlockState state)`
- `IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `IBlockState getStateFromMeta(int meta)`
- `protected boolean isSameRailWithPower(World worldIn, BlockPos pos, boolean p_176567_3_, int distance, BlockRailBase.EnumRailDirection p_176567_5_)`
- `protected void updateState(IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyBool POWERED`
- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`