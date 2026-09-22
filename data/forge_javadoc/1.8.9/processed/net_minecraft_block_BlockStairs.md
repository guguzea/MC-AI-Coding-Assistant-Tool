# BlockStairs

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockStairs

## Class signature

```java
public class BlockStairs extends Block
```

## Constructors

- `BlockStairs(IBlockState modelState)`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `void breakBlock(World worldIn, BlockPos pos, IBlockState state)`
- `boolean canCollideCheck(IBlockState state, boolean hitIfLiquid)`
- `boolean canPlaceBlockAt(World worldIn, BlockPos pos)`
- `MovingObjectPosition collisionRayTrace(World worldIn, BlockPos pos, Vec3 start, Vec3 end)` — Ray traces through the blocks collision from start vector to end vector returning a ray trace hit.
- `protected BlockState createBlockState()`
- `boolean doesSideBlockRendering(IBlockAccess world, BlockPos pos, EnumFacing face)` — Check if the face of a block should block rendering.
- `boolean func_176304_i(IBlockAccess blockAccess, BlockPos pos)`
- `int func_176305_g(IBlockAccess blockAccess, BlockPos pos)`
- `boolean func_176306_h(IBlockAccess blockAccess, BlockPos pos)`
- `int func_176307_f(IBlockAccess blockAccess, BlockPos pos)`
- `IBlockState getActualState(IBlockState state, IBlockAccess worldIn, BlockPos pos)` — Get the actual Block state of this Block at the given position.
- `EnumWorldBlockLayer getBlockLayer()`
- `float getExplosionResistance(Entity exploder)` — Returns how much this block can resist explosions from the passed in entity.
- `MapColor getMapColor(IBlockState state)` — Get the MapColor for this Block and the given BlockState
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `int getMixedBrightnessForBlock(IBlockAccess worldIn, BlockPos pos)`
- `AxisAlignedBB getSelectedBoundingBox(World worldIn, BlockPos pos)`
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `static boolean isBlockStairs(Block blockIn)` — Checks if a block is stairs
- `boolean isCollidable()` — Returns if this block is collidable (only used by Fire).
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `static boolean isSameStair(IBlockAccess worldIn, BlockPos pos, IBlockState state)` — Check whether there is a stair block at the given position and it has the same properties as the given BlockState
- `Vec3 modifyAcceleration(World worldIn, BlockPos pos, Entity entityIn, Vec3 motion)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockClicked(World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `void onBlockDestroyedByExplosion(World worldIn, BlockPos pos, Explosion explosionIn)` — Called when this Block is destroyed by an Explosion
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)` — Called when a player destroys this Block
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, Entity entityIn)` — Triggered whenever an entity collides with this block (enters into the block)
- `void randomDisplayTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `void setBaseCollisionBounds(IBlockAccess worldIn, BlockPos pos)` — Set the block bounds as the collision bounds for the stairs at the given position
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `int tickRate(World worldIn)` — How many world ticks before ticking
- `void updateTick(World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`

## Fields

- `static PropertyDirection FACING`
- `static PropertyEnum<BlockStairs.EnumHalf> HALF`
- `static PropertyEnum<BlockStairs.EnumShape> SHAPE`