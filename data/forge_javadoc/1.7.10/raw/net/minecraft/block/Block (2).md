---
title: "Block"
description: "public class Block extends java.lang.Object"
package: "net/minecraft/block"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/block/Block.html"
sourceType: javadoc
---

# Block

## Class signature

```java
public class Block extends java.lang.Object
```

## Constructors

- `protected Block( Material p_i45394_1_)`

## Methods

- `public static int getIdFromBlock( Block p_149682_0_)`
- `public static Block getBlockById(int p_149729_0_)`
- `public static Block getBlockFromItem( Item p_149634_0_)`
- `public static Block getBlockFromName(java.lang.String p_149684_0_)`
- `public boolean func_149730_j()`
- `public int getLightOpacity()`
- `public boolean getCanBlockGrass()`
- `public int getLightValue()`
- `public boolean getUseNeighborBrightness()`
- `public Material getMaterial()`
- `public MapColor getMapColor(int p_149728_1_)`
- `public static void registerBlocks()`
- `public Block setStepSound( Block.SoundType p_149672_1_)`
- `public Block setLightOpacity(int p_149713_1_)`
- `public Block setLightLevel(float p_149715_1_)`
- `public Block setResistance(float p_149752_1_)`
- `public boolean isBlockNormalCube()`
- `public boolean isNormalCube()`
- `public boolean renderAsNormalBlock()`
- `public boolean getBlocksMovement( IBlockAccess p_149655_1_, int p_149655_2_, int p_149655_3_, int p_149655_4_)`
- `public int getRenderType()`
- `public Block setHardness(float p_149711_1_)`
- `public Block setBlockUnbreakable()`
- `public float getBlockHardness( World p_149712_1_, int p_149712_2_, int p_149712_3_, int p_149712_4_)`
- `public Block setTickRandomly(boolean p_149675_1_)`
- `public boolean getTickRandomly()`
- `public boolean hasTileEntity()`
- `public final void setBlockBounds(float p_149676_1_, float p_149676_2_, float p_149676_3_, float p_149676_4_, float p_149676_5_, float p_149676_6_)`
- `public int getMixedBrightnessForBlock( IBlockAccess p_149677_1_, int p_149677_2_, int p_149677_3_, int p_149677_4_)`
- `public boolean shouldSideBeRendered( IBlockAccess p_149646_1_, int p_149646_2_, int p_149646_3_, int p_149646_4_, int p_149646_5_)`
- `public boolean isBlockSolid( IBlockAccess p_149747_1_, int p_149747_2_, int p_149747_3_, int p_149747_4_, int p_149747_5_)`
- `public IIcon getIcon( IBlockAccess p_149673_1_, int p_149673_2_, int p_149673_3_, int p_149673_4_, int p_149673_5_)`
- `public IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `public void addCollisionBoxesToList( World p_149743_1_, int p_149743_2_, int p_149743_3_, int p_149743_4_, AxisAlignedBB p_149743_5_, java.util.List p_149743_6_, Entity p_149743_7_)`
- `public AxisAlignedBB getCollisionBoundingBoxFromPool( World p_149668_1_, int p_149668_2_, int p_149668_3_, int p_149668_4_)`
- `public final IIcon getBlockTextureFromSide(int p_149733_1_)`
- `public AxisAlignedBB getSelectedBoundingBoxFromPool( World p_149633_1_, int p_149633_2_, int p_149633_3_, int p_149633_4_)`
- `public boolean isOpaqueCube()`
- `public boolean canCollideCheck(int p_149678_1_, boolean p_149678_2_)`
- `public boolean isCollidable()`
- `public void updateTick( World p_149674_1_, int p_149674_2_, int p_149674_3_, int p_149674_4_, java.util.Random p_149674_5_)`
- `public void randomDisplayTick( World p_149734_1_, int p_149734_2_, int p_149734_3_, int p_149734_4_, java.util.Random p_149734_5_)`
- `public void onBlockDestroyedByPlayer( World p_149664_1_, int p_149664_2_, int p_149664_3_, int p_149664_4_, int p_149664_5_)`
- `public void onNeighborBlockChange( World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `public int tickRate( World p_149738_1_)`
- `public void onBlockAdded( World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `public void breakBlock( World p_149749_1_, int p_149749_2_, int p_149749_3_, int p_149749_4_, Block p_149749_5_, int p_149749_6_)`
- `public int quantityDropped(java.util.Random p_149745_1_)`
- `public Item getItemDropped(int p_149650_1_, java.util.Random p_149650_2_, int p_149650_3_)`
- `public float getPlayerRelativeBlockHardness( EntityPlayer p_149737_1_, World p_149737_2_, int p_149737_3_, int p_149737_4_, int p_149737_5_)`
- `public final void dropBlockAsItem( World p_149697_1_, int p_149697_2_, int p_149697_3_, int p_149697_4_, int p_149697_5_, int p_149697_6_)`
- `public void dropBlockAsItemWithChance( World p_149690_1_, int p_149690_2_, int p_149690_3_, int p_149690_4_, int p_149690_5_, float p_149690_6_, int p_149690_7_)`
- `protected void dropBlockAsItem( World p_149642_1_, int p_149642_2_, int p_149642_3_, int p_149642_4_, ItemStack p_149642_5_)`
- `public void dropXpOnBlockBreak( World p_149657_1_, int p_149657_2_, int p_149657_3_, int p_149657_4_, int p_149657_5_)`
- `public int damageDropped(int p_149692_1_)`
- `public float getExplosionResistance( Entity p_149638_1_)`
- `public MovingObjectPosition collisionRayTrace( World p_149731_1_, int p_149731_2_, int p_149731_3_, int p_149731_4_, Vec3 p_149731_5_, Vec3 p_149731_6_)`
- `public void onBlockDestroyedByExplosion( World p_149723_1_, int p_149723_2_, int p_149723_3_, int p_149723_4_, Explosion p_149723_5_)`
- `public boolean canReplace( World p_149705_1_, int p_149705_2_, int p_149705_3_, int p_149705_4_, int p_149705_5_, ItemStack p_149705_6_)`
- `public int getRenderBlockPass()`
- `public boolean canPlaceBlockOnSide( World p_149707_1_, int p_149707_2_, int p_149707_3_, int p_149707_4_, int p_149707_5_)`
- `public boolean canPlaceBlockAt( World p_149742_1_, int p_149742_2_, int p_149742_3_, int p_149742_4_)`
- `public boolean onBlockActivated( World p_149727_1_, int p_149727_2_, int p_149727_3_, int p_149727_4_, EntityPlayer p_149727_5_, int p_149727_6_, float p_149727_7_, float p_149727_8_, float p_149727_9_)`
- `public void onEntityWalking( World p_149724_1_, int p_149724_2_, int p_149724_3_, int p_149724_4_, Entity p_149724_5_)`
- `public int onBlockPlaced( World p_149660_1_, int p_149660_2_, int p_149660_3_, int p_149660_4_, int p_149660_5_, float p_149660_6_, float p_149660_7_, float p_149660_8_, int p_149660_9_)`
- `public void onBlockClicked( World p_149699_1_, int p_149699_2_, int p_149699_3_, int p_149699_4_, EntityPlayer p_149699_5_)`
- `public void velocityToAddToEntity( World p_149640_1_, int p_149640_2_, int p_149640_3_, int p_149640_4_, Entity p_149640_5_, Vec3 p_149640_6_)`
- `public void setBlockBoundsBasedOnState( IBlockAccess p_149719_1_, int p_149719_2_, int p_149719_3_, int p_149719_4_)`
- `public final double getBlockBoundsMinX()`
- `public final double getBlockBoundsMaxX()`
- `public final double getBlockBoundsMinY()`
- `public final double getBlockBoundsMaxY()`
- `public final double getBlockBoundsMinZ()`
- `public final double getBlockBoundsMaxZ()`
- `public int getBlockColor()`
- `public int getRenderColor(int p_149741_1_)`
- `public int colorMultiplier( IBlockAccess p_149720_1_, int p_149720_2_, int p_149720_3_, int p_149720_4_)`
- `public int isProvidingWeakPower( IBlockAccess p_149709_1_, int p_149709_2_, int p_149709_3_, int p_149709_4_, int p_149709_5_)`
- `public boolean canProvidePower()`
- `public void onEntityCollidedWithBlock( World p_149670_1_, int p_149670_2_, int p_149670_3_, int p_149670_4_, Entity p_149670_5_)`
- `public int isProvidingStrongPower( IBlockAccess p_149748_1_, int p_149748_2_, int p_149748_3_, int p_149748_4_, int p_149748_5_)`
- `public void setBlockBoundsForItemRender()`
- `public void harvestBlock( World p_149636_1_, EntityPlayer p_149636_2_, int p_149636_3_, int p_149636_4_, int p_149636_5_, int p_149636_6_)`
- `protected boolean canSilkHarvest()`
- `protected ItemStack createStackedBlock(int p_149644_1_)`
- `public int quantityDroppedWithBonus(int p_149679_1_, java.util.Random p_149679_2_)`
- `public boolean canBlockStay( World p_149718_1_, int p_149718_2_, int p_149718_3_, int p_149718_4_)`
- `public void onBlockPlacedBy( World p_149689_1_, int p_149689_2_, int p_149689_3_, int p_149689_4_, EntityLivingBase p_149689_5_, ItemStack p_149689_6_)`
- `public void onPostBlockPlaced( World p_149714_1_, int p_149714_2_, int p_149714_3_, int p_149714_4_, int p_149714_5_)`
- `public Block setBlockName(java.lang.String p_149663_1_)`
- `public java.lang.String getLocalizedName()`
- `public java.lang.String getUnlocalizedName()`
- `public boolean onBlockEventReceived( World p_149696_1_, int p_149696_2_, int p_149696_3_, int p_149696_4_, int p_149696_5_, int p_149696_6_)`
- `public boolean getEnableStats()`
- `protected Block disableStats()`
- `public int getMobilityFlag()`
- `public float getAmbientOcclusionLightValue()`
- `public void onFallenUpon( World p_149746_1_, int p_149746_2_, int p_149746_3_, int p_149746_4_, Entity p_149746_5_, float p_149746_6_)`
- `public Item getItem( World p_149694_1_, int p_149694_2_, int p_149694_3_, int p_149694_4_)`
- `public int getDamageValue( World p_149643_1_, int p_149643_2_, int p_149643_3_, int p_149643_4_)`
- `public void getSubBlocks( Item p_149666_1_, CreativeTabs p_149666_2_, java.util.List p_149666_3_)`
- `public Block setCreativeTab( CreativeTabs p_149647_1_)`
- `public void onBlockHarvested( World p_149681_1_, int p_149681_2_, int p_149681_3_, int p_149681_4_, int p_149681_5_, EntityPlayer p_149681_6_)`
- `public CreativeTabs getCreativeTabToDisplayOn()`
- `public void onBlockPreDestroy( World p_149725_1_, int p_149725_2_, int p_149725_3_, int p_149725_4_, int p_149725_5_)`
- `public void fillWithRain( World p_149639_1_, int p_149639_2_, int p_149639_3_, int p_149639_4_)`
- `public boolean isFlowerPot()`
- `public boolean func_149698_L()`
- `public boolean canDropFromExplosion( Explosion p_149659_1_)`
- `public boolean isAssociatedBlock( Block p_149667_1_)`
- `public static boolean isEqualTo( Block p_149680_0_, Block p_149680_1_)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World p_149736_1_, int p_149736_2_, int p_149736_3_, int p_149736_4_, int p_149736_5_)`
- `public Block setBlockTextureName(java.lang.String p_149658_1_)`
- `protected java.lang.String getTextureName()`
- `public IIcon func_149735_b(int p_149735_1_, int p_149735_2_)`
- `public void registerBlockIcons( IIconRegister p_149651_1_)`
- `public java.lang.String getItemIconName()`
