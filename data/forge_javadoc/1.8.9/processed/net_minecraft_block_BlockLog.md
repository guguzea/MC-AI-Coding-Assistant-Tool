# BlockLog

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRotatedPillar → net.minecraft.block.BlockLog

## Class signature

```java
public abstract class BlockLog extends BlockRotatedPillar
```

## Constructors

- `BlockLog()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canSustainLeaves(IBlockAccess world, BlockPos pos)` — Determines if this block can prevent leaves connected to it from decaying.
- `boolean isWood(IBlockAccess world, BlockPos pos)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate

## Fields

- `static PropertyEnum<BlockLog.EnumAxis> LOG_AXIS`