# BlockDoor

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockDoor

## Class signature

```java
public class BlockDoor extends Block
```

## Constructors

- `BlockDoor(Material materialIn)`

## Methods

- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `MovingObjectPosition collisionRayTrace(World worldIn, BlockPos pos, Vec3 start, Vec3 end)` — Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.
- `static int combineMetadata(IBlockAccess worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `static EnumFacing getFacing(IBlockAccess worldIn, BlockPos pos)`
- `static EnumFacing getFacing(int combinedMeta)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getMobilityFlag()`
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean isFullCube()`
- `protected static boolean isHingeLeft(int combinedMeta)`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `static boolean isOpen(IBlockAccess worldIn, BlockPos pos)`
- `protected static boolean isOpen(int combinedMeta)`
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `protected static boolean isTop(int meta)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockHarvested(World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `protected static int removeHalfBit(int meta)`
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void toggleDoor(World worldIn, BlockPos pos, boolean open)`

## Fields

- `static PropertyDirection FACING`
- `static PropertyEnum<BlockDoor.EnumDoorHalf> HALF`
- `static PropertyEnum<BlockDoor.EnumHingePosition> HINGE`
- `static PropertyBool OPEN`
- `static PropertyBool POWERED`