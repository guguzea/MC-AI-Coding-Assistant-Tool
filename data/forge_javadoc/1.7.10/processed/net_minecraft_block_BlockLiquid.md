# BlockLiquid

**Inheritance:** java.lang.Object → net.minecraft.block.Block → net.minecraft.block.BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Methods

- `boolean canCollideCheck(int p_149678_1_, boolean p_149678_2_)`
- `int colorMultiplier(IBlockAccess p_149720_1_, int p_149720_2_, int p_149720_3_, int p_149720_4_)`
- `protected void func_149799_m(World p_149799_1_, int p_149799_2_, int p_149799_3_, int p_149799_4_)`
- `protected int func_149804_e(World p_149804_1_, int p_149804_2_, int p_149804_3_, int p_149804_4_)`
- `int getBlockColor()`
- `boolean getBlocksMovement(IBlockAccess p_149655_1_, int p_149655_2_, int p_149655_3_, int p_149655_4_)`
- `AxisAlignedBB getCollisionBoundingBoxFromPool(World p_149668_1_, int p_149668_2_, int p_149668_3_, int p_149668_4_)`
- `protected int getEffectiveFlowDecay(IBlockAccess p_149798_1_, int p_149798_2_, int p_149798_3_, int p_149798_4_)`
- `static double getFlowDirection(IBlockAccess p_149802_0_, int p_149802_1_, int p_149802_2_, int p_149802_3_, Material p_149802_4_)`
- `IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `Item getItemDropped(int p_149650_1_, java.util.Random p_149650_2_, int p_149650_3_)`
- `static float getLiquidHeightPercent(int p_149801_0_)`
- `static IIcon getLiquidIcon(java.lang.String p_149803_0_)`
- `int getMixedBrightnessForBlock(IBlockAccess p_149677_1_, int p_149677_2_, int p_149677_3_, int p_149677_4_)`
- `int getRenderBlockPass()`
- `int getRenderType()`
- `boolean isBlockSolid(IBlockAccess p_149747_1_, int p_149747_2_, int p_149747_3_, int p_149747_4_, int p_149747_5_)`
- `boolean isOpaqueCube()`
- `void onBlockAdded(World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `void onNeighborBlockChange(World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `int quantityDropped(java.util.Random p_149745_1_)`
- `void randomDisplayTick(World p_149734_1_, int p_149734_2_, int p_149734_3_, int p_149734_4_, java.util.Random p_149734_5_)`
- `void registerBlockIcons(IIconRegister p_149651_1_)`
- `boolean renderAsNormalBlock()`
- `boolean shouldSideBeRendered(IBlockAccess p_149646_1_, int p_149646_2_, int p_149646_3_, int p_149646_4_, int p_149646_5_)`
- `int tickRate(World p_149738_1_)`
- `void velocityToAddToEntity(World p_149640_1_, int p_149640_2_, int p_149640_3_, int p_149640_4_, Entity p_149640_5_, Vec3 p_149640_6_)`

## Fields

- `protected BlockLiquid`