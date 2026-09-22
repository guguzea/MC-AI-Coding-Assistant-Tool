# BlockWeb

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockWeb

## Class signature

```java
public class BlockWeb extends Block
```

## Methods

- `protected boolean canSilkHarvest()`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block

## Fields

- `BlockWeb`