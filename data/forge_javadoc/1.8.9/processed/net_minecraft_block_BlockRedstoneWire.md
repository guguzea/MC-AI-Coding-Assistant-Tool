# BlockRedstoneWire

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRedstoneWire

## Class signature

```java
public class BlockRedstoneWire extends Block
```

## Constructors

- `BlockRedstoneWire()`

## Methods

- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `boolean canProvidePower()` — Can this block provide power.
- `protected static boolean canRestoneConnect(IBlockAccess world, BlockPos pos, EnumFacing side)`
- `int colorMultiplier(IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `protected BlockState createBlockState()`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItem(World worldIn, BlockPos pos)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)` — Get the Item that this Block should drop when harvested.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `int getStrongPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `int getWeakPower(IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> EAST`
- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> NORTH`
- `static PropertyInteger POWER`
- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> SOUTH`
- `static PropertyEnum<net.minecraft.block.BlockRedstoneWire.EnumAttachPosition> WEST`