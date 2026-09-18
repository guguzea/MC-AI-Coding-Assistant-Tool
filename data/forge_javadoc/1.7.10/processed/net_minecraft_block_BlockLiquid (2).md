# BlockLiquid

## Class signature

```java
public abstract class BlockLiquid extends Block
```

## Constructors

- `protected BlockLiquid( Material p_i45413_1_)`

## Methods

- `public boolean getBlocksMovement( IBlockAccess p_149655_1_, int p_149655_2_, int p_149655_3_, int p_149655_4_)`
- `public static float getLiquidHeightPercent(int p_149801_0_)`
- `public int getBlockColor()`
- `public int colorMultiplier( IBlockAccess p_149720_1_, int p_149720_2_, int p_149720_3_, int p_149720_4_)`
- `public IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `protected int func_149804_e( World p_149804_1_, int p_149804_2_, int p_149804_3_, int p_149804_4_)`
- `protected int getEffectiveFlowDecay( IBlockAccess p_149798_1_, int p_149798_2_, int p_149798_3_, int p_149798_4_)`
- `public boolean renderAsNormalBlock()`
- `public boolean isOpaqueCube()`
- `public boolean canCollideCheck(int p_149678_1_, boolean p_149678_2_)`
- `public boolean isBlockSolid( IBlockAccess p_149747_1_, int p_149747_2_, int p_149747_3_, int p_149747_4_, int p_149747_5_)`
- `public boolean shouldSideBeRendered( IBlockAccess p_149646_1_, int p_149646_2_, int p_149646_3_, int p_149646_4_, int p_149646_5_)`
- `public AxisAlignedBB getCollisionBoundingBoxFromPool( World p_149668_1_, int p_149668_2_, int p_149668_3_, int p_149668_4_)`
- `public int getRenderType()`
- `public Item getItemDropped(int p_149650_1_, java.util.Random p_149650_2_, int p_149650_3_)`
- `public int quantityDropped(java.util.Random p_149745_1_)`
- `public void velocityToAddToEntity( World p_149640_1_, int p_149640_2_, int p_149640_3_, int p_149640_4_, Entity p_149640_5_, Vec3 p_149640_6_)`
- `public int tickRate( World p_149738_1_)`
- `public int getMixedBrightnessForBlock( IBlockAccess p_149677_1_, int p_149677_2_, int p_149677_3_, int p_149677_4_)`
- `public int getRenderBlockPass()`
- `public void randomDisplayTick( World p_149734_1_, int p_149734_2_, int p_149734_3_, int p_149734_4_, java.util.Random p_149734_5_)`
- `public void onBlockAdded( World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `public static double getFlowDirection( IBlockAccess p_149802_0_, int p_149802_1_, int p_149802_2_, int p_149802_3_, Material p_149802_4_)`
- `public void onNeighborBlockChange( World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `protected void func_149799_m( World p_149799_1_, int p_149799_2_, int p_149799_3_, int p_149799_4_)`
- `public void registerBlockIcons( IIconRegister p_149651_1_)`
- `public static IIcon getLiquidIcon(java.lang.String p_149803_0_)`