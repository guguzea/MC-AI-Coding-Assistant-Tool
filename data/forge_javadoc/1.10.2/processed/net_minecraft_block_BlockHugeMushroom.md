# BlockHugeMushroom

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockHugeMushroom

## Class signature

```java
public class BlockHugeMushroom extends Block
```

## Constructors

- `BlockHugeMushroom(Material materialIn, MapColor color, Block smallBlockIn)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `ItemStack getItem(World worldIn, BlockPos pos, IBlockState state)`
- `Item getItemDropped(IBlockState state, java.util.Random rand, int fortune)`
- `MapColor getMapColor(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `int quantityDropped(java.util.Random random)`
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `IBlockState withMirror(IBlockState state, Mirror mirrorIn)`
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<BlockHugeMushroom.EnumType> VARIANT`