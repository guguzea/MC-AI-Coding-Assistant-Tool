# BlockTNT

**Inheritance:** java.lang.Object → net.minecraftforge.registries.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockTNT

## Class signature

```java
public class BlockTNT extends Block
```

## Constructors

- `BlockTNT()`

## Methods

- `boolean canDropFromExplosion(Explosion explosionIn)`
- `protected BlockStateContainer createBlockState()`
- `void explode(World worldIn, BlockPos pos, IBlockState state, EntityLivingBase igniter)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `void neighborChanged(IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `boolean onBlockActivated(World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `void onBlockAdded(World worldIn, BlockPos pos, IBlockState state)`
- `void onBlockDestroyedByExplosion(World worldIn, BlockPos pos, Explosion explosionIn)`
- `void onBlockDestroyedByPlayer(World worldIn, BlockPos pos, IBlockState state)`
- `void onEntityCollidedWithBlock(World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`

## Fields

- `static PropertyBool EXPLODE`