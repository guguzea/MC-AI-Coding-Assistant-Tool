# BlockMushroom

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockMushroom

## Class signature

```java
public class BlockMushroom extends BlockBush implements IGrowable
```

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canGrow(World worldIn, BlockPos pos, IBlockState state, boolean isClient)` — Whether this IGrowable can grow
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean canPlaceBlockOn(Block ground)` — is the block grass, dirt or farmland
- `boolean canUseBonemeal(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `boolean generateBigMushroom(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void grow(World worldIn, java.util.Random rand, BlockPos pos, IBlockState state)`
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected BlockMushroom`