# BlockPane

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockPane

## Class signature

```java
public class BlockPane extends Block
```

## Constructors

- `BlockPane(Material materialIn, boolean canDrop)`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `boolean canPaneConnectTo(IBlockAccess world, BlockPos pos, EnumFacing dir)`
- `boolean canPaneConnectToBlock(Block blockIn)`
- `protected boolean canSilkHarvest()`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`

## Fields

- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool SOUTH`
- `static PropertyBool WEST`