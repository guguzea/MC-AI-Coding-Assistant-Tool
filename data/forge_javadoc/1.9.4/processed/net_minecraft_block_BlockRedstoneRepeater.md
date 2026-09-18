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
- `public IBlockState withRotation( IBlockState state, Rotation rot)`
- `public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `protected int getDelay( IBlockState state)`
- `protected IBlockState getPoweredState( IBlockState unpoweredState)`
- `protected IBlockState getUnpoweredState( IBlockState poweredState)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isLocked( IBlockAccess worldIn, BlockPos pos, IBlockState state)`
- `protected boolean isAlternateInput( IBlockState state)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`