---
title: "Block"
description: "Deprecated."
package: "net/minecraft/block"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/Block.html"
sourceType: javadoc
---

# Block

## Class signature

```java
public class Block extends java.lang.Object
```

## Constructors

- `public Block( Material p_i46399_1_, MapColor p_i46399_2_)`
- `public Block( Material materialIn)`

## Methods

- `public static int getIdFromBlock( Block blockIn)`
- `public static int getStateId( IBlockState state)`
- `public static Block getBlockById(int id)`
- `public static IBlockState getStateById(int id)`
- `public static Block getBlockFromItem( Item itemIn)`
- `public static Block getBlockFromName(java.lang.String name)`
- `public boolean isFullBlock()`
- `public int getLightOpacity()`
- `public boolean isTranslucent()`
- `public int getLightValue()`
- `public boolean getUseNeighborBrightness()`
- `public Material getMaterial()`
- `public MapColor getMapColor( IBlockState state)`
- `public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `public Block setStepSound( Block.SoundType sound)`
- `public Block setLightOpacity(int opacity)`
- `public Block setLightLevel(float value)`
- `public Block setResistance(float resistance)`
- `public boolean isBlockNormalCube()`
- `public boolean isNormalCube()`
- `public boolean isVisuallyOpaque()`
- `public boolean isFullCube()`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `public int getRenderType()`
- `public boolean isReplaceable( World worldIn, BlockPos pos)`
- `public Block setHardness(float hardness)`
- `public Block setBlockUnbreakable()`
- `public float getBlockHardness( World worldIn, BlockPos pos)`
- `public Block setTickRandomly(boolean shouldTick)`
- `public boolean getTickRandomly()`
- `@Deprecated public boolean hasTileEntity()`
- `public final void setBlockBounds(float minX, float minY, float minZ, float maxX, float maxY, float maxZ)`
- `public int getMixedBrightnessForBlock( IBlockAccess worldIn, BlockPos pos)`
- `public boolean shouldSideBeRendered( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public boolean isBlockSolid( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `public AxisAlignedBB getSelectedBoundingBox( World worldIn, BlockPos pos)`
- `public void addCollisionBoxesToList( World worldIn, BlockPos pos, IBlockState state, AxisAlignedBB mask, java.util.List< AxisAlignedBB > list, Entity collidingEntity)`
- `public AxisAlignedBB getCollisionBoundingBox( World worldIn, BlockPos pos, IBlockState state)`
- `public boolean isOpaqueCube()`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean isCollidable()`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `public void onNeighborBlockChange( World worldIn, BlockPos pos, IBlockState state, Block neighborBlock)`
- `public int tickRate( World worldIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `public float getPlayerRelativeBlockHardness( EntityPlayer playerIn, World worldIn, BlockPos pos)`
- `public final void dropBlockAsItem( World worldIn, BlockPos pos, IBlockState state, int forture)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public static void spawnAsEntity( World worldIn, BlockPos pos, ItemStack stack)`
- `public void dropXpOnBlockBreak( World worldIn, BlockPos pos, int amount)`
- `public int damageDropped( IBlockState state)`
- `public float getExplosionResistance( Entity exploder)`
- `public MovingObjectPosition collisionRayTrace( World worldIn, BlockPos pos, Vec3 start, Vec3 end)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public boolean canReplace( World worldIn, BlockPos pos, EnumFacing side, ItemStack stack)`
- `public EnumWorldBlockLayer getBlockLayer()`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, Entity entityIn)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public Vec3 modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3 motion)`
- `public void setBlockBoundsBasedOnState( IBlockAccess worldIn, BlockPos pos)`
- `public final double getBlockBoundsMinX()`
- `public final double getBlockBoundsMaxX()`
- `public final double getBlockBoundsMinY()`
- `public final double getBlockBoundsMaxY()`
- `public final double getBlockBoundsMinZ()`
- `public final double getBlockBoundsMaxZ()`
- `public int getBlockColor()`
- `public int getRenderColor( IBlockState state)`
- `public int colorMultiplier( IBlockAccess worldIn, BlockPos pos, int renderPass)`
- `public int getWeakPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public final int colorMultiplier( IBlockAccess worldIn, BlockPos pos)`
- `public boolean canProvidePower()`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `public int getStrongPower( IBlockAccess worldIn, BlockPos pos, IBlockState state, EnumFacing side)`
- `public void setBlockBoundsForItemRender()`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te)`
- `@Deprecated protected boolean canSilkHarvest()`
- `protected ItemStack createStackedBlock( IBlockState state)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public boolean func_181623_g()`
- `public Block setUnlocalizedName(java.lang.String name)`
- `public java.lang.String getLocalizedName()`
- `public java.lang.String getUnlocalizedName()`
- `public boolean onBlockEventReceived( World worldIn, BlockPos pos, IBlockState state, int eventID, int eventParam)`
- `public boolean getEnableStats()`
- `protected Block disableStats()`
- `public int getMobilityFlag()`
- `public float getAmbientOcclusionLightValue()`
- `public void onFallenUpon( World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `public void onLanded( World worldIn, Entity entityIn)`
- `public Item getItem( World worldIn, BlockPos pos)`
- `public int getDamageValue( World worldIn, BlockPos pos)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public Block setCreativeTab( CreativeTabs tab)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public CreativeTabs getCreativeTabToDisplayOn()`
- `public void fillWithRain( World worldIn, BlockPos pos)`
- `public boolean isFlowerPot()`
- `public boolean requiresUpdates()`
- `public boolean canDropFromExplosion( Explosion explosionIn)`
- `public boolean isAssociatedBlock( Block other)`
- `public static boolean isEqualTo( Block blockIn, Block other)`
- `public boolean hasComparatorInputOverride()`
- `public int getComparatorInputOverride( World worldIn, BlockPos pos)`
- `public IBlockState getStateForEntityRender( IBlockState state)`
- `protected BlockState createBlockState()`
- `public BlockState getBlockState()`

## Description

Deprecated.
