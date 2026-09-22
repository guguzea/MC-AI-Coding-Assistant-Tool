# BlockAir

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockAir

## Class signature

```java
public class BlockAir extends Block
```

## Methods

- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `void dropBlockAsItemWithChance(World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)` — Spawns this Block's drops into the World as EntityItems.
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getRenderType()` — The type of render function called. 3 for standard block models, 2 for TESR's, 1 for liquids, -1 is no render
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isReplaceable(World worldIn, BlockPos pos)` — Whether this Block can be replaced directly by other blocks (true for e.g. tall grass)

## Fields

- `protected BlockAir`