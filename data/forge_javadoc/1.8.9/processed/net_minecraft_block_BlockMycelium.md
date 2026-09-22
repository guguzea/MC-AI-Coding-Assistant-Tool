# BlockMycelium

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockMycelium

## Class signature

```java
public class BlockMycelium extends Block
```

## Constructors

- `BlockMycelium()`

## Methods

- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyBool SNOWY`