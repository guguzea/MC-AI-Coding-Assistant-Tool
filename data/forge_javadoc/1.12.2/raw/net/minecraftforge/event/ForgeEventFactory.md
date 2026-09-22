---
title: "ForgeEventFactory"
description: "public class ForgeEventFactory extends java.lang.Object"
package: "net/minecraftforge/event"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/ForgeEventFactory.html"
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

- `static boolean canCreateFluidSource(World world, BlockPos pos, IBlockState state, boolean def)`
- `static Event.Result canEntityDespawn(EntityLiving entity)`
- `@Deprecated static Event.Result canEntitySpawn(EntityLiving entity, World world, float x, float y, float z)` — Deprecated. use canEntitySpawn(EntityLiving, World, float, float, float, MobSpawnerBaseLogic) instead
- `@Deprecated static Event.Result canEntitySpawn(EntityLiving entity, World world, float x, float y, float z, boolean isSpawner)` — Deprecated. use canEntitySpawn(EntityLiving, World, float, float, float, MobSpawnerBaseLogic) instead
- `static Event.Result canEntitySpawn(EntityLiving entity, World world, float x, float y, float z, MobSpawnerBaseLogic spawner)`
- `@Deprecated static boolean canEntitySpawnSpawner(EntityLiving entity, World world, float x, float y, float z)` — Deprecated. Use canEntitySpawnSpawner(EntityLiving, World, float, float, float, MobSpawnerBaseLogic)
- `static boolean canEntitySpawnSpawner(EntityLiving entity, World world, float x, float y, float z, MobSpawnerBaseLogic spawner)`
- `static boolean canEntityUpdate(Entity entity)`
- `static boolean canMountEntity(Entity entityMounting, Entity entityBeingMounted, boolean isMounting)`
- `static boolean doPlayerHarvestCheck(EntityPlayer player, IBlockState state, boolean success)`
- `@Deprecated static boolean doSpecialSpawn(EntityLiving entity, World world, float x, float y, float z)` — Deprecated. Use canEntitySpawnSpawner(EntityLiving, World, float, float, float, MobSpawnerBaseLogic)
- `static boolean doSpecialSpawn(EntityLiving entity, World world, float x, float y, float z, MobSpawnerBaseLogic spawner)`
- `static float fireBlockHarvesting(java.util.List<ItemStack> drops, World world, BlockPos pos, IBlockState state, int fortune, float dropChance, boolean silkTouch, EntityPlayer player)`
- `static IBlockState fireFluidPlaceBlockEvent(World world, BlockPos pos, BlockPos liquidPos, IBlockState state)`
- `static void firePlayerLoadingEvent(EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `static void firePlayerLoadingEvent(EntityPlayer player, IPlayerFileData playerFileData, java.lang.String uuidString)`
- `static void firePlayerSavingEvent(EntityPlayer player, java.io.File playerDirectory, java.lang.String uuidString)`
- `static boolean fireSleepingLocationCheck(EntityPlayer player, BlockPos sleepingLocation)`
- `static boolean fireSleepingTimeCheck(EntityPlayer player, BlockPos sleepingLocation)`
- `static ZombieEvent.SummonAidEvent fireZombieSummonAid(EntityZombie zombie, World world, int x, int y, int z, EntityLivingBase attacker, double summonChance)`
- `static CapabilityDispatcher gatherCapabilities(Chunk chunk)`
- `static CapabilityDispatcher gatherCapabilities(Entity entity)`
- `static CapabilityDispatcher gatherCapabilities(ItemStack stack, ICapabilityProvider parent)`
- `static CapabilityDispatcher gatherCapabilities(TileEntity tileEntity)`
- `static CapabilityDispatcher gatherCapabilities(Village village)`
- `static CapabilityDispatcher gatherCapabilities(World world, ICapabilityProvider parent)`
- `static boolean gatherCollisionBoxes(World world, Entity entity, AxisAlignedBB aabb, java.util.List<AxisAlignedBB> outList)`
- `static float getBreakSpeed(EntityPlayer player, IBlockState state, float original, BlockPos pos)`
- `static int getExperienceDrop(EntityLivingBase entity, EntityPlayer attackingPlayer, int originalExperience)`
- `static int getItemBurnTime(ItemStack itemStack)`
- `static int getMaxSpawnPackSize(EntityLiving entity)`
- `static boolean getMobGriefingEvent(World world, Entity entity)`
- `static java.lang.String getPlayerDisplayName(EntityPlayer player, java.lang.String username)`
- `static java.util.List<Biome.SpawnListEntry> getPotentialSpawns(WorldServer world, EnumCreatureType type, BlockPos pos, java.util.List<Biome.SpawnListEntry> oldList)`
- `static MerchantRecipeList listTradeOffers(IMerchant merchant, EntityPlayer player, MerchantRecipeList list)`
- `static LootTable loadLootTable(ResourceLocation name, LootTable table, LootTableManager lootTableManager)`
- `static boolean onAnimalTame(EntityAnimal animal, EntityPlayer tamer)`
- `static int onApplyBonemeal(EntityPlayer player, World world, BlockPos pos, IBlockState state, ItemStack stack, EnumHand hand)`
- `static int onArrowLoose(ItemStack stack, World world, EntityPlayer player, int charge, boolean hasAmmo)`
- `static ActionResult<ItemStack> onArrowNock(ItemStack item, World world, EntityPlayer player, EnumHand hand, boolean hasAmmo)`
- `static BlockEvent.EntityPlaceEvent onBlockPlace(Entity entity, BlockSnapshot blockSnapshot, EnumFacing direction)`
- `static ActionResult<ItemStack> onBucketUse(EntityPlayer player, World world, ItemStack stack, RayTraceResult target)`
- `static void onChunkPopulate(boolean pre, IChunkGenerator gen, World world, java.util.Random rand, int x, int z, boolean hasVillageGenerated)`
- `static ITextComponent onClientChat(ChatType type, ITextComponent message)`
- `static java.lang.String onClientSendMessage(java.lang.String message)`
- `static boolean onCreateWorldSpawn(World world, WorldSettings settings)`
- `static int onEnchantmentLevelSet(World world, BlockPos pos, int enchantRow, int power, ItemStack itemStack, int level)`
- `static boolean onEntityDestroyBlock(EntityLivingBase entity, BlockPos pos, IBlockState state)`
- `static boolean onEntityStruckByLightning(Entity entity, EntityLightningBolt bolt)`
- `static void onExplosionDetonate(World world, Explosion explosion, java.util.List<Entity> list, double diameter)`
- `static boolean onExplosionStart(World world, Explosion explosion)`
- `static void onGameRuleChange(GameRules rules, java.lang.String ruleName, MinecraftServer server)`
- `static int onHoeUse(ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos)`
- `static int onItemExpire(EntityItem entity, ItemStack item)`
- `static int onItemPickup(EntityItem entityItem, EntityPlayer player)`
- `static ItemTooltipEvent onItemTooltip(ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, ITooltipFlag flags)`
- `static ItemStack onItemUseFinish(EntityLivingBase entity, ItemStack item, int duration, ItemStack result)`
- `static int onItemUseStart(EntityLivingBase entity, ItemStack item, int duration)`
- `static int onItemUseTick(EntityLivingBase entity, ItemStack item, int duration)`
- `static float onLivingHeal(EntityLivingBase entity, float amount)`
- `static BlockEvent.EntityMultiPlaceEvent onMultiBlockPlace(Entity entity, java.util.List<BlockSnapshot> blockSnapshots, EnumFacing direction)`
- `static BlockEvent.NeighborNotifyEvent onNeighborNotify(World world, BlockPos pos, IBlockState state, java.util.EnumSet<EnumFacing> notifiedSides, boolean forceRedstoneUpdate)`
- `static BlockEvent.PlaceEvent onPlayerBlockPlace(EntityPlayer player, BlockSnapshot blockSnapshot, EnumFacing direction, EnumHand hand)`
- `static void onPlayerBrewedPotion(EntityPlayer player, ItemStack stack)`
- `static void onPlayerClone(EntityPlayer player, EntityPlayer oldPlayer, boolean wasDeath)`
- `static void onPlayerDestroyItem(EntityPlayer player, ItemStack stack, EnumHand hand)`
- `static void onPlayerDrops(EntityPlayer player, DamageSource cause, java.util.List<EntityItem> capturedDrops, boolean recentlyHit)`
- `static void onPlayerFall(EntityPlayer player, float distance, float multiplier)`
- `static BlockEvent.MultiPlaceEvent onPlayerMultiBlockPlace(EntityPlayer player, java.util.List<BlockSnapshot> blockSnapshots, EnumFacing direction, EnumHand hand)`
- `static EntityPlayer.SleepResult onPlayerSleepInBed(EntityPlayer player, BlockPos pos)`
- `static boolean onPlayerSpawnSet(EntityPlayer player, BlockPos pos, boolean forced)`
- `static void onPlayerWakeup(EntityPlayer player, boolean wakeImmediately, boolean updateWorldFlag, boolean setSpawn)`
- `static PlaySoundAtEntityEvent onPlaySoundAtEntity(Entity entity, SoundEvent name, SoundCategory category, float volume, float pitch)`
- `static boolean onPotionAttemptBrew(NonNullList<ItemStack> stacks)`
- `static void onPotionBrewed(NonNullList<ItemStack> brewingItemStacks)`
- `static boolean onProjectileImpact(EntityArrow arrow, RayTraceResult ray)`
- `static boolean onProjectileImpact(EntityFireball fireball, RayTraceResult ray)`
- `static boolean onProjectileImpact(Entity entity, RayTraceResult ray)`
- `static boolean onProjectileImpact(EntityThrowable throwable, RayTraceResult ray)`
- `static boolean onReplaceBiomeBlocks(IChunkGenerator gen, int x, int z, ChunkPrimer primer, World world)`
- `static void onStartEntityTracking(Entity entity, EntityPlayer player)`
- `static void onStopEntityTracking(Entity entity, EntityPlayer player)`
- `static boolean onTrySpawnPortal(World world, BlockPos pos, BlockPortal.Size size)`
- `static boolean onUseItemStop(EntityLivingBase entity, ItemStack item, int duration)`
- `static boolean renderBlockOverlay(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos pos)`
- `static boolean renderFireOverlay(EntityPlayer player, float renderPartialTicks)`
- `static boolean renderWaterOverlay(EntityPlayer player, float renderPartialTicks)`
