# BlockCactus

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockCactus

## Class signature

```java
public class BlockCactus extends Block implements IPlantable
```

## Constructors

- `BlockCactus()`

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getPlant(IBlockAccess world, BlockPos pos)`
- `EnumPlantType getPlantType(IBlockAccess world, BlockPos pos)`
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)` — Called When an Entity Collided with the Block
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyInteger AGE`