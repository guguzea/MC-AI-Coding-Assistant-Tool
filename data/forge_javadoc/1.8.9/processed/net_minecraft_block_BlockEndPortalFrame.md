# BlockEndPortalFrame

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockEndPortalFrame

## Class signature

```java
public class BlockEndPortalFrame extends Block
```

## Constructors

- `BlockEndPortalFrame()`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `protected BlockState createBlockState()`
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean hasComparatorInputOverride()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item

## Fields

- `static PropertyBool EYE`
- `static PropertyDirection FACING`