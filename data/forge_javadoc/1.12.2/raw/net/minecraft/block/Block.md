---
title: "Block"
description: "Deprecated."
package: "net/minecraft/block"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/Block.html"
sourceType: javadoc
---

# Block

## Class signature

```java
public class Block extends IForgeRegistryEntry.Impl < Block >
```

## Constructors

- `public Block( Material blockMaterialIn, MapColor blockMapColorIn)`
- `public Block( Material materialIn)`

## Methods

- `public static int getIdFromBlock( Block blockIn)`
- `public static int getStateId( IBlockState state)`
- `public static Block getBlockById(int id)`
- `public static IBlockState getStateById(int id)`
- `public static Block getBlockFromItem( Item itemIn)`
- `public static Block getBlockFromName(java.lang.String name)`
- `@Deprecated public boolean isTopSolid( IBlockState state)`
- `@Deprecated public boolean isFullBlock( IBlockState state)`
- `@Deprecated public boolean canEntitySpawn( IBlockState state, Entity entityIn)`
- `@Deprecated public int getLightOpacity( IBlockState state)`
- `@Deprecated public boolean isTranslucent( IBlockState state)`
- `@Deprecated public int getLightValue( IBlockState state)`
- `@Deprecated public boolean getUseNeighborBrightness( IBlockState state)`
- `@Deprecated public Material getMaterial( IBlockState state)`
- `@Deprecated public MapColor getMapColor( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `@Deprecated public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated public IBlockState withRotation( IBlockState state, Rotation rot)`
- `@Deprecated public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected Block setSoundType( SoundType sound)`
- `public Block setLightOpacity(int opacity)`
- `public Block setLightLevel(float value)`
- `public Block setResistance(float resistance)`
- `protected static boolean isExceptionBlockForAttaching( Block attachBlock)`
- `protected static boolean isExceptBlockForAttachWithPiston( Block attachBlock)`
- `@Deprecated public boolean isBlockNormalCube( IBlockState state)`
- `@Deprecated public boolean isNormalCube( IBlockState state)`
- `@Deprecated public boolean causesSuffocation( IBlockState state)`
- `@Deprecated public boolean isFullCube( IBlockState state)`
- `@Deprecated public boolean hasCustomBreakingProgress( IBlockState state)`
- `public boolean isPassable( IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated public EnumBlockRenderType getRenderType( IBlockState state)`
- `public boolean isReplaceable( IBlockAccess worldIn, BlockPos pos)`
- `public Block setHardness(float hardness)`
- `public Block setBlockUnbreakable()`
- `@Deprecated public float getBlockHardness( IBlockState blockState, World worldIn, BlockPos pos)`
- `public Block setTickRandomly(boolean shouldTick)`
- `public boolean getTickRandomly()`
- `@Deprecated public boolean hasTileEntity()`
- `@Deprecated public AxisAlignedBB getBoundingBox( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Deprecated public int getPackedLightmapCoords( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Deprecated public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `@Deprecated public BlockFaceShape getBlockFaceShape( IBlockAccess worldIn, IBlockState state, BlockPos pos, EnumFacing face)`
- `@Deprecated public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, Entity entityIn, boolean isActualState)`
- `protected static void addCollisionBoxToList( BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, AxisAlignedBB blockBox)`
- `@Deprecated public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated public AxisAlignedBB getSelectedBoundingBox( IBlockState state, World worldIn, BlockPos pos)`
- `@Deprecated public boolean isOpaqueCube( IBlockState state)`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean isCollidable()`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `@Deprecated public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn, BlockPos fromPos)`
- `public int tickRate( World worldIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `@Deprecated public float getPlayerRelativeBlockHardness( IBlockState state, EntityPlayer player, World worldIn, BlockPos pos)`
- `public final void dropBlockAsItem( World worldIn, BlockPos pos, IBlockState state, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public static void spawnAsEntity( World worldIn, BlockPos pos, ItemStack stack)`
- `public void dropXpOnBlockBreak( World worldIn, BlockPos pos, int amount)`
- `public int damageDropped( IBlockState state)`
- `@Deprecated public float getExplosionResistance( Entity exploder)`
- `@Deprecated public RayTraceResult collisionRayTrace( IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `protected RayTraceResult rayTrace( BlockPos pos, Vec3d start, Vec3d end, AxisAlignedBB boundingBox)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public BlockRenderLayer getBlockLayer()`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, EnumFacing facing, float hitX, float hitY, float hitZ)`
- `public void onEntityWalk( World worldIn, BlockPos pos, Entity entityIn)`
- `@Deprecated public IBlockState getStateForPlacement( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public Vec3d modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `@Deprecated public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `@Deprecated public boolean canProvidePower( IBlockState state)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `@Deprecated public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, TileEntity te, ItemStack stack)`
- `@Deprecated protected boolean canSilkHarvest()`
- `protected ItemStack getSilkTouchDrop( IBlockState state)`
- `public int quantityDroppedWithBonus(int fortune, java.util.Random random)`
- `public void onBlockPlacedBy( World worldIn, BlockPos pos, IBlockState state, EntityLivingBase placer, ItemStack stack)`
- `public boolean canSpawnInBlock()`
- `public Block setUnlocalizedName(java.lang.String name)`
- `public java.lang.String getLocalizedName()`
- `public java.lang.String getUnlocalizedName()`
- `@Deprecated public boolean eventReceived( IBlockState state, World worldIn, BlockPos pos, int id, int param)`
- `public boolean getEnableStats()`
- `protected Block disableStats()`
- `@Deprecated public EnumPushReaction getMobilityFlag( IBlockState state)`
- `@Deprecated public float getAmbientOcclusionLightValue( IBlockState state)`
- `public void onFallenUpon( World worldIn, BlockPos pos, Entity entityIn, float fallDistance)`
- `public void onLanded( World worldIn, Entity entityIn)`
- `@Deprecated public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( CreativeTabs itemIn, NonNullList < ItemStack > items)`
- `public CreativeTabs getCreativeTabToDisplayOn()`
- `public Block setCreativeTab( CreativeTabs tab)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public void fillWithRain( World worldIn, BlockPos pos)`
- `public boolean requiresUpdates()`
- `public boolean canDropFromExplosion( Explosion explosionIn)`
- `public boolean isAssociatedBlock( Block other)`
- `public static boolean isEqualTo( Block blockIn, Block other)`
- `@Deprecated public boolean hasComparatorInputOverride( IBlockState state)`
- `@Deprecated public int getComparatorInputOverride( IBlockState blockState, World worldIn, BlockPos pos)`
- `protected BlockStateContainer createBlockState()`
- `public BlockStateContainer getBlockState()`
- `protected final void setDefaultState( IBlockState state)`
- `public final IBlockState getDefaultState()`
- `public Block.EnumOffsetType getOffsetType()`
- `@Deprecated public Vec3d getOffset( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated public SoundType getSoundType()`
- `public java.lang.String toString()`
- `public void addInformation( ItemStack stack, World player, java.util.List<java.lang.String> tooltip, ITooltipFlag advanced)`

## Description

Deprecated.
