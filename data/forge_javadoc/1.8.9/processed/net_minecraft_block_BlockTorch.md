# BlockTorch

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockTorch

## Class signature

```java
public class BlockTorch extends Block
```

## Constructors

- `BlockTorch()`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean checkForDrop(World worldIn, BlockPos pos, IBlockState state)`
- `MovingObjectPosition collisionRayTrace(World worldIn, BlockPos pos, Vec3 start, Vec3 end)` — Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.
- `protected BlockState createBlockState()`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `protected boolean onNeighborChangeInternal(World worldIn, BlockPos pos, IBlockState state)`
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyDirection FACING`