---
title: "ForgeEventFactory"
description: "Deprecated. Use onChunkPopulate(boolean, IChunkGenerator, World, Random, int, int, boolean) The Random param should not be world.rand, it should be the same chunk-position-seeded rand used by the Chun"
package: "net/minecraftforge/event"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/ForgeEventFactory.html"
sourceType: javadoc
---

# ForgeEventFactory

## Class signature

```java
public class ForgeEventFactory extends java.lang.Object
```

## Constructors

- `public ForgeEventFactory()`

## Methods

- `@Deprecated public static BlockEvent.MultiPlaceEvent onPlayerMultiBlockPlace( EntityPlayer player, java.util.List< BlockSnapshot > blockSnapshots, EnumFacing direction)`
- `public static BlockEvent.MultiPlaceEvent onPlayerMultiBlockPlace( EntityPlayer player, java.util.List< BlockSnapshot > blockSnapshots, EnumFacing direction, @Nullable EnumHand hand)`
- `@Deprecated public static BlockEvent.PlaceEvent onPlayerBlockPlace( EntityPlayer player, BlockSnapshot blockSnapshot, EnumFacing direction)`
- `public static BlockEvent.PlaceEvent onPlayerBlockPlace(@Nonnull EntityPlayer player, @Nonnull BlockSnapshot blockSnapshot, @Nonnull EnumFacing direction, @Nonnull EnumHand hand)`
- `public static BlockEvent.NeighborNotifyEvent onNeighborNotify( World world, BlockPos pos, IBlockState state, java.util.EnumSet< EnumFacing > notifiedSides, boolean forceRedstoneUpdate)`
- `public static boolean doPlayerHarvestCheck( EntityPlayer player, IBlockState state, boolean success)`
- `public static float getBreakSpeed( EntityPlayer player, IBlockState state, float original, BlockPos pos)`
- `public static void onPlayerDestroyItem( EntityPlayer player, @Nonnull ItemStack stack, @Nullable EnumHand hand)`
- `public static Event.Result canEntitySpawn( EntityLiving entity, World world, float x, float y, float z)`
- `public static boolean canEntitySpawnSpawner( EntityLiving entity, World world, float x, float y, float z)`
- `public static boolean doSpecialSpawn( EntityLiving entity, World world, float x, float y, float z)`
- `public static Event.Result canEntityDespawn( EntityLiving entity)`
- `public static int getExperienceDrop( EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`
- `@Nullable public static java.util.List< Biome.SpawnListEntry > getPotentialSpawns( WorldServer world, EnumCreatureType type, BlockPos pos, java.util.List< Biome.SpawnListEntry > oldList)`
- `public static int getMaxSpawnPackSize( EntityLiving entity)`
- `public static java.lang.String getPlayerDisplayName( EntityPlayer player, java.lang.String username)`
- `public static java.util.List<com.google.common.base.Predicate< Entity >> gatherEntitySelectors(java.util.Map<java.lang.String,java.lang.String> map, java.lang.String mainSelector, ICommandSender sender, Vec3d position)`
- `public static float fireBlockHarvesting(java.util.List< ItemStack > drops, World world, BlockPos pos, IBlockState state, int fortune, float dropChance, boolean silkTouch, EntityPlayer player)`
- `public static ItemTooltipEvent onItemTooltip( ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`
- `public static ZombieEvent.SummonAidEvent fireZombieSummonAid( EntityZombie zombie, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`
- `public static boolean onEntityStruckByLightning( Entity entity, EntityLightningBolt bolt)`
- `public static int onItemUseStart( EntityLivingBase entity, ItemStack item, int duration)`
- `public static int onItemUseTick( EntityLivingBase entity, ItemStack item, int duration)`
- `public static boolean onUseItemStop( EntityLivingBase entity, ItemStack item, int duration)`
- `public static ItemStack onItemUseFinish( EntityLivingBase entity, ItemStack item, int duration, ItemStack result)`
- `public static void onStartEntityTracking( Entity entity, EntityPlayer player)`
- `public static void onStopEntityTracking( Entity entity, EntityPlayer player)`
- `public static void firePlayerLoadingEvent( EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `public static void firePlayerSavingEvent( EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `public static void firePlayerLoadingEvent( EntityPlayer player, IPlayerFileData playerFileData, java.lang.String uuidString)`
- `@Nullable public static ITextComponent onClientChat(byte type, ITextComponent message)`
- `public static int onHoeUse( ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos)`
- `public static int onApplyBonemeal( EntityPlayer player, World world, BlockPos pos, IBlockState state, ItemStack stack)`
- `@Nullable public static ActionResult < ItemStack > onBucketUse(@Nonnull EntityPlayer player, @Nonnull World world, @Nonnull ItemStack stack, @Nullable RayTraceResult target)`
- `public static boolean canEntityUpdate( Entity entity)`
- `public static PlaySoundAtEntityEvent onPlaySoundAtEntity( Entity entity, SoundEvent name, SoundCategory category, float volume, float pitch)`
- `public static int onItemExpire( EntityItem entity, @Nonnull ItemStack item)`
- `public static int onItemPickup( EntityItem entityItem, EntityPlayer entityIn, ItemStack itemstack)`
- `public static void onPlayerDrops( EntityPlayer player, DamageSource cause, java.util.List< EntityItem > capturedDrops, boolean recentlyHit)`
- `public static boolean canMountEntity( Entity entityMounting, Entity entityBeingMounted, boolean isMounting)`
- `public static EntityPlayer.SleepResult onPlayerSleepInBed( EntityPlayer player, BlockPos pos)`
- `public static void onPlayerWakeup( EntityPlayer player, boolean wakeImmediately, boolean updateWorldFlag, boolean setSpawn)`
- `public static void onPlayerFall( EntityPlayer player, float distance, float multiplier)`
- `public static boolean onPlayerSpawnSet( EntityPlayer player, BlockPos pos, boolean forced)`
- `public static void onPlayerClone( EntityPlayer player, EntityPlayer oldPlayer, boolean wasDeath)`
- `public static boolean onExplosionStart( World world, Explosion explosion)`
- `public static void onExplosionDetonate( World world, Explosion explosion, java.util.List< Entity > list, double diameter)`
- `public static boolean onCreateWorldSpawn( World world, WorldSettings settings)`
- `public static float onLivingHeal( EntityLivingBase entity, float amount)`
- `public static boolean onPotionAttemptBrew( NonNullList < ItemStack > stacks)`
- `public static void onPotionBrewed( NonNullList < ItemStack > brewingItemStacks)`
- `public static void onPlayerBrewedPotion( EntityPlayer player, ItemStack stack)`
- `public static boolean renderFireOverlay( EntityPlayer player, float renderPartialTicks)`
- `public static boolean renderWaterOverlay( EntityPlayer player, float renderPartialTicks)`
- `public static boolean renderBlockOverlay( EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos pos)`
- `@Nullable public static CapabilityDispatcher gatherCapabilities( TileEntity tileEntity)`
- `@Nullable public static CapabilityDispatcher gatherCapabilities( Entity entity)`
- `@Nullable public static CapabilityDispatcher gatherCapabilities( Item item, ItemStack stack, ICapabilityProvider parent)`
- `@Nullable public static CapabilityDispatcher gatherCapabilities( World world, ICapabilityProvider parent)`
- `public static boolean fireSleepingLocationCheck( EntityPlayer player, BlockPos sleepingLocation)`
- `public static ActionResult < ItemStack > onArrowNock( ItemStack item, World world, EntityPlayer player, EnumHand hand, boolean hasAmmo)`
- `public static int onArrowLoose( ItemStack stack, World world, EntityPlayer player, int charge, boolean hasAmmo)`
- `public static boolean onReplaceBiomeBlocks( IChunkGenerator gen, int x, int z, ChunkPrimer primer, World world)`
- `@Deprecated public static void onChunkPopulate(boolean pre, IChunkGenerator gen, World world, int x, int z, boolean hasVillageGenerated)`
- `public static void onChunkPopulate(boolean pre, IChunkGenerator gen, World world, java.util.Random rand, int x, int z, boolean hasVillageGenerated)`
- `public static LootTable loadLootTable( ResourceLocation name, LootTable table)`
- `public static boolean canCreateFluidSource( World world, BlockPos pos, IBlockState state, boolean def)`
- `public static int onEnchantmentLevelSet( World world, BlockPos pos, int enchantRow, int power, ItemStack itemStack, int level)`

## Description

Deprecated. Use onChunkPopulate(boolean, IChunkGenerator, World, Random, int, int, boolean) The Random param should not be world.rand, it should be the same chunk-position-seeded rand used by the Chun
