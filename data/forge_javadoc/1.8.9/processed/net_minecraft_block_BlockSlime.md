# BlockSlime

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBreakable → net.minecraft.block.BlockSlime

## Class signature

```java
public class BlockSlime extends BlockBreakable
```

## Methods

- `EnumWorldBlockLayer getBlockLayer()`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, Entity entityIn)` — Triggered whenever an entity collides with this block (enters into the block)
- `void onFallenUpon(World worldIn, BlockPos pos, Entity entityIn, float fallDistance)` — Block's chance to react to a living entity falling on it.
- `void onLanded(World worldIn, Entity entityIn)` — Called when an Entity lands on this Block.

## Fields

- `BlockSlime`