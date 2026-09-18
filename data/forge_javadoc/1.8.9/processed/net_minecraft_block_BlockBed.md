# BlockBed

## Class signature

```java
public class BlockBed extends BlockDirectional
```

## Constructors

- `public BlockBed()`

## Methods

- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public boolean isFullCube()`
- `public boolean isOpaqueCube()`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public static BlockPos getSafeExitLocation( World worldIn, BlockPos pos, int tries)`
- `protected static boolean hasRoomForPlayer( World worldIn, BlockPos pos)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public int getMobilityFlag()`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public IBlockState getStateFromMeta(int meta)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Spawns this Block's drops into the World as EntityItems.