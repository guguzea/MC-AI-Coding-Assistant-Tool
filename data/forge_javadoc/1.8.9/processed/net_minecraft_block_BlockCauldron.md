# BlockCauldron

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockCauldron

## Class signature

```java
public class BlockCauldron extends Block
```

## Constructors

- `BlockCauldron()`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `protected BlockState createBlockState()`
- `void fillWithRain(World worldIn, BlockPos pos)` — Called similar to random ticks, but only when it is raining.
- `int getComparatorInputOverride(World worldIn, BlockPos pos)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean hasComparatorInputOverride()`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `void setWaterLevel(World worldIn, BlockPos pos, IBlockState state, int level)`

## Fields

- `static PropertyInteger LEVEL`