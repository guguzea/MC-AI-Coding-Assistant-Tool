# ForgeEventFactory

## Class signature

```java
public class ForgeEventFactory extends java.lang.Object
```

## Constructors

- `public ForgeEventFactory()`

## Methods

- `public static BlockEvent.MultiPlaceEvent onPlayerMultiBlockPlace( EntityPlayer player, java.util.List< BlockSnapshot > blockSnapshots, EnumFacing direction)`
- `public static BlockEvent.PlaceEvent onPlayerBlockPlace( EntityPlayer player, BlockSnapshot blockSnapshot, EnumFacing direction)`
- `public static BlockEvent.NeighborNotifyEvent onNeighborNotify( World world, BlockPos pos, IBlockState state, java.util.EnumSet< EnumFacing > notifiedSides)`
- `public static boolean doPlayerHarvestCheck( EntityPlayer player, Block block, boolean success)`
- `public static float getBreakSpeed( EntityPlayer player, IBlockState state, float original, BlockPos pos)`
- `@Deprecated public static PlayerInteractEvent onPlayerInteract( EntityPlayer player, PlayerInteractEvent.Action action, World world, BlockPos pos, EnumFacing face)`
- `public static PlayerInteractEvent onPlayerInteract( EntityPlayer player, PlayerInteractEvent.Action action, World world, BlockPos pos, EnumFacing face, Vec3 localPos)`
- `public static void onPlayerDestroyItem( EntityPlayer player, ItemStack stack)`
- `public static Event.Result canEntitySpawn( EntityLiving entity, World world, float x, float y, float z)`
- `public static boolean doSpecialSpawn( EntityLiving entity, World world, float x, float y, float z)`
- `public static Event.Result canEntityDespawn( EntityLiving entity)`
- `public static int getExperienceDrop( EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`
- `public static java.util.List< BiomeGenBase.SpawnListEntry > getPotentialSpawns( WorldServer world, EnumCreatureType type, BlockPos pos, java.util.List< BiomeGenBase.SpawnListEntry > oldList)`
- `public static int getMaxSpawnPackSize( EntityLiving entity)`
- `public static java.lang.String getPlayerDisplayName( EntityPlayer player, java.lang.String username)`
- `public static float fireBlockHarvesting(java.util.List< ItemStack > drops, World world, BlockPos pos, IBlockState state, int fortune, float dropChance, boolean silkTouch, EntityPlayer player)`
- `public static ItemTooltipEvent onItemTooltip( ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`
- `public static ZombieEvent.SummonAidEvent fireZombieSummonAid( EntityZombie zombie, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`
- `public static boolean onEntityStruckByLightning( Entity entity, EntityLightningBolt bolt)`
- `public static int onItemUseStart( EntityPlayer player, ItemStack item, int duration)`
- `public static int onItemUseTick( EntityPlayer player, ItemStack item, int duration)`
- `public static boolean onUseItemStop( EntityPlayer player, ItemStack item, int duration)`
- `public static ItemStack onItemUseFinish( EntityPlayer player, ItemStack item, int duration, ItemStack result)`
- `public static void onStartEntityTracking( Entity entity, EntityPlayer player)`
- `public static void onStopEntityTracking( Entity entity, EntityPlayer player)`
- `public static void firePlayerLoadingEvent( EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `public static void firePlayerSavingEvent( EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `public static void firePlayerLoadingEvent( EntityPlayer player, IPlayerFileData playerFileData, java.lang.String uuidString)`
- `public static IChatComponent onClientChat(byte type, IChatComponent message)`
- `public static int onHoeUse( ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos)`
- `public static int onApplyBonemeal( EntityPlayer player, World world, BlockPos pos, IBlockState state, ItemStack stack)`
- `public static ItemStack onBucketUse( EntityPlayer player, World world, ItemStack stack, MovingObjectPosition target)`
- `public static boolean canEntityUpdate( Entity entity)`
- `@Deprecated public static java.lang.String onPlaySoundAt( Entity entity, java.lang.String name, float volume, float pitch)`
- `public static PlaySoundAtEntityEvent onPlaySoundAtEntity( Entity entity, java.lang.String name, float volume, float pitch)`
- `public static int onItemExpire( EntityItem entity, ItemStack item)`
- `public static int onItemPickup( EntityItem entityItem, EntityPlayer entityIn, ItemStack itemstack)`
- `public static void onPlayerDrops( EntityPlayer player, DamageSource cause, java.util.List< EntityItem > capturedDrops, boolean recentlyHit)`
- `public static boolean canInteractWith( EntityPlayer player, Entity entity)`
- `public static boolean canMountEntity( Entity entityMounting, Entity entityBeingMounted, boolean isMounting)`
- `public static EntityPlayer.EnumStatus onPlayerSleepInBed( EntityPlayer player, BlockPos pos)`
- `public static void onPlayerWakeup( EntityPlayer player, boolean wakeImmediatly, boolean updateWorldFlag, boolean setSpawn)`
- `public static void onPlayerFall( EntityPlayer player, float distance, float multiplier)`
- `public static boolean onPlayerSpawnSet( EntityPlayer player, BlockPos pos, boolean forced)`
- `public static void onPlayerClone( EntityPlayer player, EntityPlayer oldPlayer, boolean wasDeath)`
- `public static boolean onExplosionStart( World world, Explosion explosion)`
- `public static void onExplosionDetonate( World world, Explosion explosion, java.util.List< Entity > list, double diameter)`
- `public static boolean onCreateWorldSpawn( World world, WorldSettings settings)`
- `public static float onLivingHeal( EntityLivingBase entity, float amount)`
- `public static boolean onPotionAttemptBreaw( ItemStack [] stacks)`
- `public static void onPotionBrewed( ItemStack [] brewingItemStacks)`
- `public static boolean renderFireOverlay( EntityPlayer player, float renderPartialTicks)`
- `public static boolean renderWaterOverlay( EntityPlayer player, float renderPartialTicks)`
- `public static boolean renderBlockOverlay( EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos pos)`
- `public static CapabilityDispatcher gatherCapabilities( TileEntity tileEntity)`
- `public static CapabilityDispatcher gatherCapabilities( Entity entity)`
- `public static CapabilityDispatcher gatherCapabilities( Item item, ItemStack stack, ICapabilityProvider parent)`
- `public static boolean fireSleepingLocationCheck( EntityPlayer player, BlockPos sleepingLocation)`

## Description

Deprecated.