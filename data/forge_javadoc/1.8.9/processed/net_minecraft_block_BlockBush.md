# BlockBush

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockBush

## Class signature

```java
public class BlockBush extends Block implements IPlantable
```

## Methods

- `boolean canBlockStay(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `protected boolean canPlaceBlockOn(Block ground)` — is the block grass, dirt or farmland
- `protected void checkAndDropBlock(World worldIn, BlockPos pos, IBlockState state)`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `IBlockState getPlant(IBlockAccess world, BlockPos pos)`
- `EnumPlantType getPlantType(IBlockAccess world, BlockPos pos)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `protected BlockBush`
- `protected BlockBush`
- `protected BlockBush`