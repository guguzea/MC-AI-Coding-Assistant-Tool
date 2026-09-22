---
title: "ForgeEventFactory"
description: "public class ForgeEventFactory extends java.lang.Object"
package: "net/minecraftforge/event"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/ForgeEventFactory.html"
sourceType: javadoc
---

# ForgeEventFactory

**Inheritance:** java.lang.Object → net.minecraftforge.event.ForgeEventFactory

## Class signature

```java
public class ForgeEventFactory extends java.lang.Object
```

## Constructors

- `ForgeEventFactory()`

## Methods

- `static Event.Result canEntityDespawn(EntityLiving entity)`
- `static Event.Result canEntitySpawn(EntityLiving entity, World world, float x, float y, float z)`
- `static boolean canEntityUpdate(Entity entity)`
- `static boolean canInteractWith(EntityPlayer player, Entity entity)`
- `static boolean canMountEntity(Entity entityMounting, Entity entityBeingMounted, boolean isMounting)`
- `static boolean doPlayerHarvestCheck(EntityPlayer player, Block block, boolean success)`
- `static boolean doSpecialSpawn(EntityLiving entity, World world, float x, float y, float z)`
- `static float fireBlockHarvesting(java.util.List<ItemStack> drops, World world, BlockPos pos, IBlockState state, int fortune, float dropChance, boolean silkTouch, EntityPlayer player)`
- `static void firePlayerLoadingEvent(EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `static void firePlayerLoadingEvent(EntityPlayer player, IPlayerFileData playerFileData, java.lang.String uuidString)`
- `static void firePlayerSavingEvent(EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `static boolean fireSleepingLocationCheck(EntityPlayer player, BlockPos sleepingLocation)`
- `static ZombieEvent.SummonAidEvent fireZombieSummonAid(EntityZombie zombie, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`
- `static CapabilityDispatcher gatherCapabilities(Entity entity)`
- `static CapabilityDispatcher gatherCapabilities(Item item, ItemStack stack, ICapabilityProvider parent)`
- `static CapabilityDispatcher gatherCapabilities(TileEntity tileEntity)`
- `static float getBreakSpeed(EntityPlayer player, IBlockState state, float original, BlockPos pos)`
- `static int getExperienceDrop(EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`
- `static int getMaxSpawnPackSize(EntityLiving entity)`
- `static java.lang.String getPlayerDisplayName(EntityPlayer player, java.lang.String username)`
- `static java.util.List<BiomeGenBase.SpawnListEntry> getPotentialSpawns(WorldServer world, EnumCreatureType type, BlockPos pos, java.util.List<BiomeGenBase.SpawnListEntry> oldList)`
- `static int onApplyBonemeal(EntityPlayer player, World world, BlockPos pos, IBlockState state, ItemStack stack)`
- `static ItemStack onBucketUse(EntityPlayer player, World world, ItemStack stack, MovingObjectPosition target)`
- `static IChatComponent onClientChat(byte type, IChatComponent message)`
- `static boolean onCreateWorldSpawn(World world, WorldSettings settings)`
- `static boolean onEntityStruckByLightning(Entity entity, EntityLightningBolt bolt)`
- `static void onExplosionDetonate(World world, Explosion explosion, java.util.List<Entity> list, double diameter)`
- `static boolean onExplosionStart(World world, Explosion explosion)`
- `static int onHoeUse(ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos)`
- `static int onItemExpire(EntityItem entity, ItemStack item)`
- `static int onItemPickup(EntityItem entityItem, EntityPlayer entityIn, ItemStack itemstack)`
- `static ItemTooltipEvent onItemTooltip(ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`
- `static ItemStack onItemUseFinish(EntityPlayer player, ItemStack item, int duration, ItemStack result)`
- `static int onItemUseStart(EntityPlayer player, ItemStack item, int duration)`
- `static int onItemUseTick(EntityPlayer player, ItemStack item, int duration)`
- `static float onLivingHeal(EntityLivingBase entity, float amount)`
- `static BlockEvent.NeighborNotifyEvent onNeighborNotify(World world, BlockPos pos, IBlockState state, java.util.EnumSet<EnumFacing> notifiedSides)`
- `static BlockEvent.PlaceEvent onPlayerBlockPlace(EntityPlayer player, BlockSnapshot blockSnapshot, EnumFacing direction)`
- `static void onPlayerClone(EntityPlayer player, EntityPlayer oldPlayer, boolean wasDeath)`
- `static void onPlayerDestroyItem(EntityPlayer player, ItemStack stack)`
- `static void onPlayerDrops(EntityPlayer player, DamageSource cause, java.util.List<EntityItem> capturedDrops, boolean recentlyHit)`
- `static void onPlayerFall(EntityPlayer player, float distance, float multiplier)`
- `@Deprecated static PlayerInteractEvent onPlayerInteract(EntityPlayer player, PlayerInteractEvent.Action action, World world, BlockPos pos, EnumFacing face)`
- `static PlayerInteractEvent onPlayerInteract(EntityPlayer player, PlayerInteractEvent.Action action, World world, BlockPos pos, EnumFacing face, Vec3 localPos)`
- `static BlockEvent.MultiPlaceEvent onPlayerMultiBlockPlace(EntityPlayer player, java.util.List<BlockSnapshot> blockSnapshots, EnumFacing direction)`
- `static EntityPlayer.EnumStatus onPlayerSleepInBed(EntityPlayer player, BlockPos pos)`
- `static boolean onPlayerSpawnSet(EntityPlayer player, BlockPos pos, boolean forced)`
- `static void onPlayerWakeup(EntityPlayer player, boolean wakeImmediatly, boolean updateWorldFlag, boolean setSpawn)`
- `@Deprecated static java.lang.String onPlaySoundAt(Entity entity, java.lang.String name, float volume, float pitch)`
- `static PlaySoundAtEntityEvent onPlaySoundAtEntity(Entity entity, java.lang.String name, float volume, float pitch)`
- `static boolean onPotionAttemptBreaw(ItemStack [] stacks)`
- `static void onPotionBrewed(ItemStack [] brewingItemStacks)`
- `static void onStartEntityTracking(Entity entity, EntityPlayer player)`
- `static void onStopEntityTracking(Entity entity, EntityPlayer player)`
- `static boolean onUseItemStop(EntityPlayer player, ItemStack item, int duration)`
- `static boolean renderBlockOverlay(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos pos)`
- `static boolean renderFireOverlay(EntityPlayer player, float renderPartialTicks)`
- `static boolean renderWaterOverlay(EntityPlayer player, float renderPartialTicks)`
