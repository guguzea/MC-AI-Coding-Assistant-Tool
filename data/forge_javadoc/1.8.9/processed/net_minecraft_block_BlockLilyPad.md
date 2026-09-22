# BlockLilyPad

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush → net.minecraft.block.BlockLilyPad

## Class signature

```java
public class BlockLilyPad extends BlockBush
```

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canPlaceBlockOn(Block ground)` — is the block grass, dirt or farmland
- `int colorMultiplier(IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `int getBlockColor()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getRenderColor(IBlockState state)`

## Fields

- `protected BlockLilyPad`