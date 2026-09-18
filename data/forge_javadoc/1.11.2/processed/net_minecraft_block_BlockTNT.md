# BlockTNT

## Class signature

```java
public class BlockTNT extends Block
```

## Constructors

- `public BlockTNT()`

## Methods

- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public void explode( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase igniter)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public boolean canDropFromExplosion( Explosion explosionIn)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `protected BlockStateContainer createBlockState()`