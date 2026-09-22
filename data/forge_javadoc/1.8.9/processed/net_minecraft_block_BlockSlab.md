# BlockSlab

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockSlab

## Class signature

```java
public abstract class BlockSlab extends Block
```

## Constructors

- `BlockSlab(Material materialIn)`

## Methods

- `void addCollisionBoxesToList(World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List<AxisAlignedBB> list, Entity collidingEntity)` — Add all collision boxes of this Block to the list that intersect with the given mask.
- `protected boolean canSilkHarvest()`
- `boolean doesSideBlockRendering(IBlockAccess world, BlockPos pos, EnumFacing face)` — Check if the face of a block should block rendering.
- `int getDamageValue(World worldIn, BlockPos pos)`
- `abstract java.lang.String getUnlocalizedName(int meta)` — Returns the slab block name with the type associated with it
- `abstract java.lang.Object getVariant(ItemStack stack)`
- `abstract IProperty<?> getVariantProperty()`
- `abstract boolean isDouble()`
- `boolean isFullCube()`
- `boolean isOpaqueCube()` — Used to determine ambient occlusion and culling when rebuilding chunks for render
- `protected static boolean isSlab(Block blockIn)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate
- `int quantityDropped(java.util.Random random)` — Returns the quantity of items to drop on block destruction.
- `void setBlockBoundsBasedOnState(IBlockAccess worldIn, BlockPos pos)`
- `void setBlockBoundsForItemRender()` — Sets the block's bounds for rendering it as an item
- `boolean shouldSideBeRendered(IBlockAccess worldIn, BlockPos pos, EnumFacing side)`

## Fields

- `static PropertyEnum<BlockSlab.EnumBlockHalf> HALF`