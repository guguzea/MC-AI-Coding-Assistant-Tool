# Block

**Inheritance:** java.lang.Object → net.minecraft.block.Block

## Class signature

```java
public class Block extends java.lang.Object
```

## Constructors

- `Block(Material p_i45394_1_)`

## Methods

- `void addCollisionBoxesToList(World p_149743_1_, int p_149743_2_, int p_149743_3_, int p_149743_4_, AxisAlignedBB p_149743_5_, java.util.List p_149743_6_, Entity p_149743_7_)`
- `void breakBlock(World p_149749_1_, int p_149749_2_, int p_149749_3_, int p_149749_4_, Block p_149749_5_, int p_149749_6_)`
- `boolean canBlockStay(World p_149718_1_, int p_149718_2_, int p_149718_3_, int p_149718_4_)`
- `boolean canCollideCheck(int p_149678_1_, boolean p_149678_2_)`
- `boolean canDropFromExplosion(Explosion p_149659_1_)`
- `boolean canPlaceBlockAt(World p_149742_1_, int p_149742_2_, int p_149742_3_, int p_149742_4_)`
- `boolean canPlaceBlockOnSide(World p_149707_1_, int p_149707_2_, int p_149707_3_, int p_149707_4_, int p_149707_5_)`
- `boolean canProvidePower()`
- `boolean canReplace(World p_149705_1_, int p_149705_2_, int p_149705_3_, int p_149705_4_, int p_149705_5_, ItemStack p_149705_6_)`
- `protected boolean canSilkHarvest()`
- `MovingObjectPosition collisionRayTrace(World p_149731_1_, int p_149731_2_, int p_149731_3_, int p_149731_4_, Vec3 p_149731_5_, Vec3 p_149731_6_)`
- `int colorMultiplier(IBlockAccess p_149720_1_, int p_149720_2_, int p_149720_3_, int p_149720_4_)`
- `protected ItemStack createStackedBlock(int p_149644_1_)`
- `int damageDropped(int p_149692_1_)`
- `protected Block disableStats()`
- `void dropBlockAsItem(World p_149697_1_, int p_149697_2_, int p_149697_3_, int p_149697_4_, int p_149697_5_, int p_149697_6_)`
- `protected void dropBlockAsItem(World p_149642_1_, int p_149642_2_, int p_149642_3_, int p_149642_4_, ItemStack p_149642_5_)`
- `void dropBlockAsItemWithChance(World p_149690_1_, int p_149690_2_, int p_149690_3_, int p_149690_4_, int p_149690_5_, float p_149690_6_, int p_149690_7_)`
- `void dropXpOnBlockBreak(World p_149657_1_, int p_149657_2_, int p_149657_3_, int p_149657_4_, int p_149657_5_)`
- `void fillWithRain(World p_149639_1_, int p_149639_2_, int p_149639_3_, int p_149639_4_)`
- `boolean func_149698_L()`
- `boolean func_149730_j()`
- `IIcon func_149735_b(int p_149735_1_, int p_149735_2_)`
- `float getAmbientOcclusionLightValue()`
- `double getBlockBoundsMaxX()`
- `double getBlockBoundsMaxY()`
- `double getBlockBoundsMaxZ()`
- `double getBlockBoundsMinX()`
- `double getBlockBoundsMinY()`
- `double getBlockBoundsMinZ()`
- `static Block getBlockById(int p_149729_0_)`
- `int getBlockColor()`
- `static Block getBlockFromItem(Item p_149634_0_)`
- `static Block getBlockFromName(java.lang.String p_149684_0_)`
- `float getBlockHardness(World p_149712_1_, int p_149712_2_, int p_149712_3_, int p_149712_4_)`
- `boolean getBlocksMovement(IBlockAccess p_149655_1_, int p_149655_2_, int p_149655_3_, int p_149655_4_)`
- `IIcon getBlockTextureFromSide(int p_149733_1_)`
- `boolean getCanBlockGrass()`
- `AxisAlignedBB getCollisionBoundingBoxFromPool(World p_149668_1_, int p_149668_2_, int p_149668_3_, int p_149668_4_)`
- `int getComparatorInputOverride(World p_149736_1_, int p_149736_2_, int p_149736_3_, int p_149736_4_, int p_149736_5_)`
- `CreativeTabs getCreativeTabToDisplayOn()`
- `int getDamageValue(World p_149643_1_, int p_149643_2_, int p_149643_3_, int p_149643_4_)`
- `boolean getEnableStats()`
- `float getExplosionResistance(Entity p_149638_1_)`
- `IIcon getIcon(IBlockAccess p_149673_1_, int p_149673_2_, int p_149673_3_, int p_149673_4_, int p_149673_5_)`
- `IIcon getIcon(int p_149691_1_, int p_149691_2_)`
- `static int getIdFromBlock(Block p_149682_0_)`
- `Item getItem(World p_149694_1_, int p_149694_2_, int p_149694_3_, int p_149694_4_)`
- `Item getItemDropped(int p_149650_1_, java.util.Random p_149650_2_, int p_149650_3_)`
- `java.lang.String getItemIconName()`
- `int getLightOpacity()`
- `int getLightValue()`
- `java.lang.String getLocalizedName()`
- `MapColor getMapColor(int p_149728_1_)`
- `Material getMaterial()`
- `int getMixedBrightnessForBlock(IBlockAccess p_149677_1_, int p_149677_2_, int p_149677_3_, int p_149677_4_)`
- `int getMobilityFlag()`
- `float getPlayerRelativeBlockHardness(EntityPlayer p_149737_1_, World p_149737_2_, int p_149737_3_, int p_149737_4_, int p_149737_5_)`
- `int getRenderBlockPass()`
- `int getRenderColor(int p_149741_1_)`
- `int getRenderType()`
- `AxisAlignedBB getSelectedBoundingBoxFromPool(World p_149633_1_, int p_149633_2_, int p_149633_3_, int p_149633_4_)`
- `void getSubBlocks(Item p_149666_1_, CreativeTabs p_149666_2_, java.util.List p_149666_3_)`
- `protected java.lang.String getTextureName()`
- `boolean getTickRandomly()`
- `java.lang.String getUnlocalizedName()`
- `boolean getUseNeighborBrightness()`
- `void harvestBlock(World p_149636_1_, EntityPlayer p_149636_2_, int p_149636_3_, int p_149636_4_, int p_149636_5_, int p_149636_6_)`
- `boolean hasComparatorInputOverride()`
- `boolean hasTileEntity()`
- `boolean isAssociatedBlock(Block p_149667_1_)`
- `boolean isBlockNormalCube()`
- `boolean isBlockSolid(IBlockAccess p_149747_1_, int p_149747_2_, int p_149747_3_, int p_149747_4_, int p_149747_5_)`
- `boolean isCollidable()`
- `static boolean isEqualTo(Block p_149680_0_, Block p_149680_1_)`
- `boolean isFlowerPot()`
- `boolean isNormalCube()`
- `boolean isOpaqueCube()`
- `int isProvidingStrongPower(IBlockAccess p_149748_1_, int p_149748_2_, int p_149748_3_, int p_149748_4_, int p_149748_5_)`
- `int isProvidingWeakPower(IBlockAccess p_149709_1_, int p_149709_2_, int p_149709_3_, int p_149709_4_, int p_149709_5_)`
- `boolean onBlockActivated(World p_149727_1_, int p_149727_2_, int p_149727_3_, int p_149727_4_, EntityPlayer p_149727_5_, int p_149727_6_, float p_149727_7_, float p_149727_8_, float p_149727_9_)`
- `void onBlockAdded(World p_149726_1_, int p_149726_2_, int p_149726_3_, int p_149726_4_)`
- `void onBlockClicked(World p_149699_1_, int p_149699_2_, int p_149699_3_, int p_149699_4_, EntityPlayer p_149699_5_)`
- `void onBlockDestroyedByExplosion(World p_149723_1_, int p_149723_2_, int p_149723_3_, int p_149723_4_, Explosion p_149723_5_)`
- `void onBlockDestroyedByPlayer(World p_149664_1_, int p_149664_2_, int p_149664_3_, int p_149664_4_, int p_149664_5_)`
- `boolean onBlockEventReceived(World p_149696_1_, int p_149696_2_, int p_149696_3_, int p_149696_4_, int p_149696_5_, int p_149696_6_)`
- `void onBlockHarvested(World p_149681_1_, int p_149681_2_, int p_149681_3_, int p_149681_4_, int p_149681_5_, EntityPlayer p_149681_6_)`
- `int onBlockPlaced(World p_149660_1_, int p_149660_2_, int p_149660_3_, int p_149660_4_, int p_149660_5_, float p_149660_6_, float p_149660_7_, float p_149660_8_, int p_149660_9_)`
- `void onBlockPlacedBy(World p_149689_1_, int p_149689_2_, int p_149689_3_, int p_149689_4_, EntityLivingBase p_149689_5_, ItemStack p_149689_6_)`
- `void onBlockPreDestroy(World p_149725_1_, int p_149725_2_, int p_149725_3_, int p_149725_4_, int p_149725_5_)`
- `void onEntityCollidedWithBlock(World p_149670_1_, int p_149670_2_, int p_149670_3_, int p_149670_4_, Entity p_149670_5_)`
- `void onEntityWalking(World p_149724_1_, int p_149724_2_, int p_149724_3_, int p_149724_4_, Entity p_149724_5_)`
- `void onFallenUpon(World p_149746_1_, int p_149746_2_, int p_149746_3_, int p_149746_4_, Entity p_149746_5_, float p_149746_6_)`
- `void onNeighborBlockChange(World p_149695_1_, int p_149695_2_, int p_149695_3_, int p_149695_4_, Block p_149695_5_)`
- `void onPostBlockPlaced(World p_149714_1_, int p_149714_2_, int p_149714_3_, int p_149714_4_, int p_149714_5_)`
- `int quantityDropped(java.util.Random p_149745_1_)`
- `int quantityDroppedWithBonus(int p_149679_1_, java.util.Random p_149679_2_)`
- `void randomDisplayTick(World p_149734_1_, int p_149734_2_, int p_149734_3_, int p_149734_4_, java.util.Random p_149734_5_)`
- `void registerBlockIcons(IIconRegister p_149651_1_)`
- `static void registerBlocks()`
- `boolean renderAsNormalBlock()`
- `void setBlockBounds(float p_149676_1_, float p_149676_2_, float p_149676_3_, float p_149676_4_, float p_149676_5_, float p_149676_6_)`
- `void setBlockBoundsBasedOnState(IBlockAccess p_149719_1_, int p_149719_2_, int p_149719_3_, int p_149719_4_)`
- `void setBlockBoundsForItemRender()`
- `Block setBlockName(java.lang.String p_149663_1_)`
- `Block setBlockTextureName(java.lang.String p_149658_1_)`
- `Block setBlockUnbreakable()`
- `Block setCreativeTab(CreativeTabs p_149647_1_)`
- `Block setHardness(float p_149711_1_)`
- `Block setLightLevel(float p_149715_1_)`
- `Block setLightOpacity(int p_149713_1_)`
- `Block setResistance(float p_149752_1_)`
- `Block setStepSound(Block.SoundType p_149672_1_)`
- `Block setTickRandomly(boolean p_149675_1_)`
- `boolean shouldSideBeRendered(IBlockAccess p_149646_1_, int p_149646_2_, int p_149646_3_, int p_149646_4_, int p_149646_5_)`
- `int tickRate(World p_149738_1_)`
- `void updateTick(World p_149674_1_, int p_149674_2_, int p_149674_3_, int p_149674_4_, java.util.Random p_149674_5_)`
- `void velocityToAddToEntity(World p_149640_1_, int p_149640_2_, int p_149640_3_, int p_149640_4_, Entity p_149640_5_, Vec3 p_149640_6_)`

## Fields

- `protected boolean blockConstructorCalled`
- `protected float blockHardness`
- `protected IIcon blockIcon`
- `protected Material blockMaterial`
- `float blockParticleGravity`
- `static RegistryNamespaced blockRegistry`
- `protected float blockResistance`
- `protected boolean canBlockGrass`
- `RegistryDelegate<Block> delegate`
- `protected boolean enableStats`
- `protected boolean isBlockContainer`
- `protected int lightOpacity`
- `protected int lightValue`
- `protected double maxX`
- `protected double maxY`
- `protected double maxZ`
- `protected double minX`
- `protected double minY`
- `protected double minZ`
- `protected boolean needsRandomTick`
- `protected boolean opaque`
- `float slipperiness`
- `static Block.SoundType soundTypeAnvil`
- `static Block.SoundType soundTypeCloth`
- `static Block.SoundType soundTypeGlass`
- `static Block.SoundType soundTypeGrass`
- `static Block.SoundType soundTypeGravel`
- `static Block.SoundType soundTypeLadder`
- `static Block.SoundType soundTypeMetal`
- `static Block.SoundType soundTypePiston`
- `static Block.SoundType soundTypeSand`
- `static Block.SoundType soundTypeSnow`
- `static Block.SoundType soundTypeStone`
- `static Block.SoundType soundTypeWood`
- `Block.SoundType stepSound`
- `protected java.lang.String textureName`
- `protected boolean useNeighborBrightness`