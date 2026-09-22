# BlockRailPowered

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRailBase → net.minecraft.block.BlockRailPowered

## Class signature

```java
public class BlockRailPowered extends BlockRailBase
```

## Constructors

- `BlockRailPowered()`

## Methods

- `protected BlockState createBlockState()`
- `protected boolean func_176566_a(World worldIn, BlockPos pos, IBlockState state, boolean p_176566_4_, int p_176566_5_)`
- `protected boolean func_176567_a(World worldIn, BlockPos p_176567_2_, boolean p_176567_3_, int distance, BlockRailBase.EnumRailDirection p_176567_5_)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IProperty<BlockRailBase.EnumRailDirection> getShapeProperty()`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `protected void onNeighborChangedInternal(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`

## Fields

- `static PropertyBool POWERED`
- `static PropertyEnum<BlockRailBase.EnumRailDirection> SHAPE`