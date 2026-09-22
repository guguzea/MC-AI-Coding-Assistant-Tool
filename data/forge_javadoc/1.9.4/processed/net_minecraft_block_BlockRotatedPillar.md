# BlockRotatedPillar

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.IForgeRegistryEntry.Impl<Block> → net.minecraft.block.Block → net.minecraft.block.BlockRotatedPillar

## Class signature

```java
public class BlockRotatedPillar extends Block
```

## Constructors

- `BlockRotatedPillar(Material materialIn)`
- `BlockRotatedPillar(Material materialIn, MapColor color)`

## Methods

- `protected BlockStateContainer createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int getMetaFromState(IBlockState state)`
- `IBlockState getStateFromMeta(int meta)`
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `boolean rotateBlock(World world, BlockPos pos, EnumFacing axis)` — Rotate the block.
- `IBlockState withRotation(IBlockState state, Rotation rot)`

## Fields

- `static PropertyEnum<EnumFacing.Axis> AXIS`