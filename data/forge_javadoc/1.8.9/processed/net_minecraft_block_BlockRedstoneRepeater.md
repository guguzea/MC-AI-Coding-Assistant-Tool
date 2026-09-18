# BlockRedstoneRepeater

## Class signature

```java
public class BlockRedstoneRepeater extends BlockRedstoneDiode
```

## Constructors

- `protected BlockRedstoneRepeater(boolean powered)`

## Methods

- `public java.lang.String getLocalizedName()`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected int getDelay( IBlockState state)`
- `protected IBlockState getPoweredState( IBlockState unpoweredState)`
- `protected IBlockState getUnpoweredState( IBlockState poweredState)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public boolean isLocked( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected boolean canPowerSide( Block blockIn)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockState createBlockState()`

## Description

Get the actual Block state of this Block at the given position.