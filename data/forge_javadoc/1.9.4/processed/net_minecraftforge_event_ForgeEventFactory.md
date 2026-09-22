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
- `static boolean canMountEntity(Entity entityMounting, Entity entityBeingMounted, boolean isMounting)`
- `static boolean doPlayerHarvestCheck(EntityPlayer player, IBlockState state, boolean success)`
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
- `static java.util.List<Biome.SpawnListEntry> getPotentialSpawns(WorldServer world, EnumCreatureType type, BlockPos pos, java.util.List<Biome.SpawnListEntry> oldList)`
- `static LootTable loadLootTable(ResourceLocation name, LootTable table)`
- `static int onApplyBonemeal(EntityPlayer player, World world, BlockPos pos, IBlockState state, ItemStack stack)`
- `static int onArrowLoose(ItemStack stack, World world, EntityPlayer player, int charge, boolean hasAmmo)`
- `static ActionResult<ItemStack> onArrowNock(ItemStack item, World world, EntityPlayer player, EnumHand hand, boolean hasAmmo)`
- `static ActionResult<ItemStack> onBucketUse(EntityPlayer player, World world, ItemStack stack, RayTraceResult target)`
- `@Deprecated static void onChunkPopulate(boolean pre, IChunkGenerator gen, World world, int x, int z, boolean hasVillageGenerated)` — Deprecated. Use onChunkPopulate(boolean, IChunkGenerator, World, Random, int, int, boolean) The Random param should not be world.rand, it should be the same chunk-position-seeded rand used by the Chunk Provider.
- `static void onChunkPopulate(boolean pre, IChunkGenerator gen, World world, java.util.Random rand, int x, int z, boolean hasVillageGenerated)`
- `static ITextComponent onClientChat(byte type, ITextComponent message)`
- `static boolean onCreateWorldSpawn(World world, WorldSettings settings)`
- `static boolean onEntityStruckByLightning(Entity entity, EntityLightningBolt bolt)`
- `static void onExplosionDetonate(World world, Explosion explosion, java.util.List<Entity> list, double diameter)`
- `static boolean onExplosionStart(World world, Explosion explosion)`
- `static int onHoeUse(ItemStack stack, EntityPlayer player, World worldIn, BlockPos pos)`
- `static int onItemExpire(EntityItem entity, ItemStack item)`
- `static int onItemPickup(EntityItem entityItem, EntityPlayer entityIn, ItemStack itemstack)`
- `static ItemTooltipEvent onItemTooltip(ItemStack itemStack, EntityPlayer entityPlayer, java.util.List<java.lang.String> toolTip, boolean showAdvancedItemTooltips)`
- `static ItemStack onItemUseFinish(EntityLivingBase entity, ItemStack item, int duration, ItemStack result)`
- `static int onItemUseStart(EntityLivingBase entity, ItemStack item, int duration)`
- `static int onItemUseTick(EntityLivingBase entity, ItemStack item, int duration)`
- `static float onLivingHeal(EntityLivingBase entity, float amount)`
- `static BlockEvent.NeighborNotifyEvent onNeighborNotify(World world, BlockPos pos, IBlockState state, java.util.EnumSet<EnumFacing> notifiedSides)`
- `static BlockEvent.PlaceEvent onPlayerBlockPlace(EntityPlayer player, BlockSnapshot blockSnapshot, EnumFacing direction)`
- `static void onPlayerClone(EntityPlayer player, EntityPlayer oldPlayer, boolean wasDeath)`
- `static void onPlayerDestroyItem(EntityPlayer player, ItemStack stack, EnumHand hand)`
- `static void onPlayerDrops(EntityPlayer player, DamageSource cause, java.util.List<EntityItem> capturedDrops, boolean recentlyHit)`
- `static void onPlayerFall(EntityPlayer player, float distance, float multiplier)`
- `static BlockEvent.MultiPlaceEvent onPlayerMultiBlockPlace(EntityPlayer player, java.util.List<BlockSnapshot> blockSnapshots, EnumFacing direction)`
- `static EntityPlayer.SleepResult onPlayerSleepInBed(EntityPlayer player, BlockPos pos)`
- `static boolean onPlayerSpawnSet(EntityPlayer player, BlockPos pos, boolean forced)`
- `static void onPlayerWakeup(EntityPlayer player, boolean wakeImmediately, boolean updateWorldFlag, boolean setSpawn)`
- `static PlaySoundAtEntityEvent onPlaySoundAtEntity(Entity entity, SoundEvent name, SoundCategory category, float volume, float pitch)`
- `static boolean onPotionAttemptBrew(ItemStack [] stacks)`
- `static void onPotionBrewed(ItemStack [] brewingItemStacks)`
- `static boolean onReplaceBiomeBlocks(IChunkGenerator gen, int x, int z, ChunkPrimer primer, World world)`
- `static void onStartEntityTracking(Entity entity, EntityPlayer player)`
- `static void onStopEntityTracking(Entity entity, EntityPlayer player)`
- `static boolean onUseItemStop(EntityLivingBase entity, ItemStack item, int duration)`
- `static boolean renderBlockOverlay(EntityPlayer player, float renderPartialTicks, RenderBlockOverlayEvent.OverlayType type, IBlockState block, BlockPos pos)`
- `static boolean renderFireOverlay(EntityPlayer player, float renderPartialTicks)`
- `static boolean renderWaterOverlay(EntityPlayer player, float renderPartialTicks)`