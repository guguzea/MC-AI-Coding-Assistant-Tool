# BlockHay

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockRotatedPillar → net.minecraft.block.BlockHay

## Class signature

```java
public class BlockHay extends BlockRotatedPillar
```

## Methods

- `protected BlockState createBlockState()`
- `protected ItemStack createStackedBlock(IBlockState state)`
- `int getMetaFromState(IBlockState state)` — Convert the BlockState into the correct metadata value
- `IBlockState getStateFromMeta(int meta)` — Convert the given metadata into a BlockState for this Block
- `IBlockState onBlockPlaced(World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)` — Called by ItemBlocks just before a block is actually set in the world, to allow for adjustments to the IBlockstate

## Fields

- `BlockHay`