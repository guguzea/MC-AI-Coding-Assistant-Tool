---
title: "Block"
description: "Deprecated."
package: "net/minecraft/block"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/block/Block.html"
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
- `@Nullable public static Block getBlockFromName(java.lang.String name)`
- `@Deprecated public boolean isFullyOpaque( IBlockState state)`
- `@Deprecated public boolean isFullBlock( IBlockState state)`
- `@Deprecated public int getLightOpacity( IBlockState state)`
- `@Deprecated public boolean isTranslucent( IBlockState state)`
- `@Deprecated public int getLightValue( IBlockState state)`
- `@Deprecated public boolean getUseNeighborBrightness( IBlockState state)`
- `@Deprecated public Material getMaterial( IBlockState state)`
- `@Deprecated public MapColor getMapColor( IBlockState state)`
- `@Deprecated public IBlockState getStateFromMeta(int meta)`
- `public int getMetaFromState( IBlockState state)`
- `@Deprecated public IBlockState getActualState( IBlockState state, IBlockAccess worldIn, BlockPos pos)`
- `@Deprecated public IBlockState withRotation( IBlockState state, Rotation rot)`
- `@Deprecated public IBlockState withMirror( IBlockState state, Mirror mirrorIn)`
- `protected Block setSoundType( SoundType sound)`
- `public Block setLightOpacity(int opacity)`
- `public Block setLightLevel(float value)`
- `public Block setResistance(float resistance)`
- `@Deprecated public boolean isBlockNormalCube( IBlockState state)`
- `@Deprecated public boolean isNormalCube( IBlockState state)`
- `public boolean isVisuallyOpaque()`
- `@Deprecated public boolean isFullCube( IBlockState state)`
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
- `public boolean isBlockSolid( IBlockAccess worldIn, BlockPos pos, EnumFacing side)`
- `@Deprecated public void addCollisionBoxToList( IBlockState state, World worldIn, BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable Entity entityIn)`
- `protected static void addCollisionBoxToList( BlockPos pos, AxisAlignedBB entityBox, java.util.List< AxisAlignedBB > collidingBoxes, @Nullable AxisAlignedBB blockBox)`
- `@Deprecated @Nullable public AxisAlignedBB getCollisionBoundingBox( IBlockState blockState, World worldIn, BlockPos pos)`
- `@Deprecated public int getPackedLightmapCoords( IBlockState state, IBlockAccess source, BlockPos pos)`
- `@Deprecated public boolean shouldSideBeRendered( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `@Deprecated public AxisAlignedBB getSelectedBoundingBox( IBlockState state, World worldIn, BlockPos pos)`
- `@Deprecated public boolean isOpaqueCube( IBlockState state)`
- `public boolean canCollideCheck( IBlockState state, boolean hitIfLiquid)`
- `public boolean isCollidable()`
- `public void randomTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random random)`
- `public void updateTick( World worldIn, BlockPos pos, IBlockState state, java.util.Random rand)`
- `public void randomDisplayTick( IBlockState stateIn, World worldIn, BlockPos pos, java.util.Random rand)`
- `public void onBlockDestroyedByPlayer( World worldIn, BlockPos pos, IBlockState state)`
- `@Deprecated public void neighborChanged( IBlockState state, World worldIn, BlockPos pos, Block blockIn)`
- `public int tickRate( World worldIn)`
- `public void onBlockAdded( World worldIn, BlockPos pos, IBlockState state)`
- `public void breakBlock( World worldIn, BlockPos pos, IBlockState state)`
- `public int quantityDropped(java.util.Random random)`
- `@Nullable public Item getItemDropped( IBlockState state, java.util.Random rand, int fortune)`
- `@Deprecated public float getPlayerRelativeBlockHardness( IBlockState state, EntityPlayer player, World worldIn, BlockPos pos)`
- `public final void dropBlockAsItem( World worldIn, BlockPos pos, IBlockState state, int fortune)`
- `public void dropBlockAsItemWithChance( World worldIn, BlockPos pos, IBlockState state, float chance, int fortune)`
- `public static void spawnAsEntity( World worldIn, BlockPos pos, ItemStack stack)`
- `public void dropXpOnBlockBreak( World worldIn, BlockPos pos, int amount)`
- `public int damageDropped( IBlockState state)`
- `public float getExplosionResistance( Entity exploder)`
- `@Deprecated @Nullable public RayTraceResult collisionRayTrace( IBlockState blockState, World worldIn, BlockPos pos, Vec3d start, Vec3d end)`
- `@Nullable protected RayTraceResult rayTrace( BlockPos pos, Vec3d start, Vec3d end, AxisAlignedBB boundingBox)`
- `public void onBlockDestroyedByExplosion( World worldIn, BlockPos pos, Explosion explosionIn)`
- `public boolean canReplace( World worldIn, BlockPos pos, EnumFacing side, @Nullable ItemStack stack)`
- `public BlockRenderLayer getBlockLayer()`
- `public boolean canPlaceBlockOnSide( World worldIn, BlockPos pos, EnumFacing side)`
- `public boolean canPlaceBlockAt( World worldIn, BlockPos pos)`
- `public boolean onBlockActivated( World worldIn, BlockPos pos, IBlockState state, EntityPlayer playerIn, EnumHand hand, @Nullable ItemStack heldItem, EnumFacing side, float hitX, float hitY, float hitZ)`
- `public void onEntityWalk( World worldIn, BlockPos pos, Entity entityIn)`
- `public IBlockState onBlockPlaced( World worldIn, BlockPos pos, EnumFacing facing, float hitX, float hitY, float hitZ, int meta, EntityLivingBase placer)`
- `public void onBlockClicked( World worldIn, BlockPos pos, EntityPlayer playerIn)`
- `public Vec3d modifyAcceleration( World worldIn, BlockPos pos, Entity entityIn, Vec3d motion)`
- `@Deprecated public int getWeakPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `@Deprecated public boolean canProvidePower( IBlockState state)`
- `public void onEntityCollidedWithBlock( World worldIn, BlockPos pos, IBlockState state, Entity entityIn)`
- `@Deprecated public int getStrongPower( IBlockState blockState, IBlockAccess blockAccess, BlockPos pos, EnumFacing side)`
- `public void harvestBlock( World worldIn, EntityPlayer player, BlockPos pos, IBlockState state, @Nullable TileEntity te, @Nullable ItemStack stack)`
- `@Deprecated protected boolean canSilkHarvest()`
- `@Nullable protected ItemStack createStackedBlock( IBlockState state)`
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
- `@Nullable @Deprecated public ItemStack getItem( World worldIn, BlockPos pos, IBlockState state)`
- `public void getSubBlocks( Item itemIn, CreativeTabs tab, java.util.List< ItemStack > list)`
- `public Block setCreativeTab( CreativeTabs tab)`
- `public void onBlockHarvested( World worldIn, BlockPos pos, IBlockState state, EntityPlayer player)`
- `public CreativeTabs getCreativeTabToDisplayOn()`
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
- `public SoundType getSoundType()`
- `public java.lang.String toString()`
- `public int getLightValue( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public boolean isLadder( IBlockState state, IBlockAccess world, BlockPos pos, EntityLivingBase entity)`
- `public boolean isNormalCube( IBlockState state, IBlockAccess world, BlockPos pos)`
- `public boolean doesSideBlockRendering( IBlockState state, IBlockAccess world, BlockPos pos, EnumFacing face)`
- `public boolean isSideSolid( IBlockState base_state, IBlockAccess world, BlockPos pos, EnumFacing side)`

## Description

Deprecated.
