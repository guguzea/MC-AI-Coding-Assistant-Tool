# BlockTrapDoor

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockTrapDoor

## Class signature

```java
public class BlockTrapDoor extends Block
```

## Constructors

- `BlockTrapDoor(Material materialIn)`

## Methods

- `boolean canPlaceBlockOnSide(World worldIn, BlockPos pos, EnumFacing side)` — Check whether this Block can be placed on the given side
- `MovingObjectPosition collisionRayTrace(World worldIn, BlockPos pos, Vec3 start, Vec3 end)` — Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.
- `protected BlockState createBlockState()`
- `EnumWorldBlockLayer getBlockLayer()`
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `protected static EnumFacing getFacing(int meta)`
- `protected static int getMetaForFacing(EnumFacing facing)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onNeighborBlockChange(World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)` — Called when a neighboring block changes.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `void setBounds(IBlockState state)`

## Fields

- `static boolean disableValidation` — Set this to allow trapdoors to remain free-floating
- `static PropertyDirection FACING`
- `static PropertyEnum<BlockTrapDoor.DoorHalf> HALF`
- `static PropertyBool OPEN`