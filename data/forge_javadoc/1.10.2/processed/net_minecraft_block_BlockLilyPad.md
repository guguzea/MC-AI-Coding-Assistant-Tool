# BlockLilyPad

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockLilyPad

## Class signature

```java
public class BlockLilyPad extends BlockBush
```

## Constructors

- `BlockLilyPad()`

## Methods

- `void addCollisionBoxToList(IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List<AxisAlignedBB> collidingBoxes, Entity entityIn)`
- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canSustainBush(IBlockState state)`
- `AxisAlignedBB getBoundingBox(IBlockState state, IBlockAccess source, BlockPos pos)`
- `int getMetaFromState(IBlockState state)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`

## Fields

- `protected static AxisAlignedBB LILY_PAD_AABB`