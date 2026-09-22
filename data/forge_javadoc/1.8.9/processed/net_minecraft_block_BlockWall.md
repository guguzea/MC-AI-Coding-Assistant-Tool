# BlockWall

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockWall

## Class signature

```java
public class BlockWall extends Block
```

## Constructors

- `BlockWall(Block modelBlock)`

## Methods

- `boolean canConnectTo(IBlockAccess worldIn, BlockPos pos)`
- `protected BlockState createBlockState()`
- `int damageDropped(IBlockState state)` — Gets the metadata of the item this Block can drop.
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `AxisAlignedBB getCollisionBoundingBox(World worldIn, BlockPos pos, IBlockState state)`
- `java.lang.String getLocalizedName()` — Gets the localized name of this block.
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `void getSubBlocks(Item itemIn, CreativeTabs tab, java.util.List<ItemStack> list)` — returns a list of blocks with the same ID, but different meta (eg: wood returns 4 blocks)
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `boolean isPassable(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`

## Fields

- `static PropertyBool EAST`
- `static PropertyBool NORTH`
- `static PropertyBool SOUTH`
- `static PropertyBool UP`
- `static PropertyEnum<BlockWall.EnumType> VARIANT`
- `static PropertyBool WEST`