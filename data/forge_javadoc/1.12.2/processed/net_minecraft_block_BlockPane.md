# BlockPane

## Class signature

```java
public class BlockPane extends Block
```

## Constructors

- `protected BlockPane( Material materialIn, boolean canDrop)`

## Methods

- `public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, Entity entityIn, boolean isActualState)`
- `public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public boolean isOpaqueCube( IBlockState state)`
- `public boolean isFullCube( IBlockState state)`
- `public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public final boolean attachesTo( IBlockAccess p_193393_1_, IBlockState state, BlockPos pos, EnumFacing facing)`
- `protected static boolean isExcepBlockForAttachWithPiston( Block p_193394_0_)`
- `protected boolean canSilkHarvest()`
- `public BlockRenderLayer getBlockLayer()`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected BlockStateContainer createBlockState()`
- `public boolean canBeConnectedTo( IBlockAccess world, BlockPos pos, EnumFacing facing)`
- `public boolean canPaneConnectTo( IBlockAccess world, BlockPos pos, EnumFacing dir)`
- `public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`

## Description

Determines if another block can connect to this block