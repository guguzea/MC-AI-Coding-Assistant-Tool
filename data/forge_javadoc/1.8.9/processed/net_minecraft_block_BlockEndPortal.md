# BlockEndPortal

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockContainer → net.minecraft.block.BlockEndPortal

## Class signature

```java
public class BlockEndPortal extends BlockContainer
```

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `TileEntity createNewTileEntity(World worldIn, int meta)` — Returns a new instance of a block's tile entity class.
- `Item getItem(World worldIn, BlockPos pos)`
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`

## Fields

- `protected BlockEndPortal`