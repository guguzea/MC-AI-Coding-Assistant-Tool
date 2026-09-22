---
title: "EntityPlayer"
description: "public abstract class EntityPlayer extends EntityLivingBase"
package: "net/minecraft/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/player/EntityPlayer.html"
sourceType: javadoc
---

# EntityPlayer

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer

## Class signature

```java
public abstract class EntityPlayer extends EntityLivingBase
```

## Constructors

- `EntityPlayer(World worldIn, GameProfile gameProfileIn)`

## Methods

- `void addExhaustion(float exhaustion)`
- `void addExperience(int amount)`
- `void addExperienceLevel(int levels)`
- `boolean addItemStackToInventory(ItemStack p_191521_1_)`
- `void addMovementStat(double p_71000_1_, double p_71000_3_, double p_71000_5_)`
- `void addPrefix(ITextComponent prefix)` — Add a prefix to the player's username in chat
- `void addScore(int scoreIn)`
- `boolean addShoulderEntity(NBTTagCompound p_192027_1_)`
- `void addStat(StatBase stat)`
- `void addStat(StatBase stat, int amount)`
- `void addSuffix(ITextComponent suffix)` — Add a suffix to the player's username in chat
- `protected void applyEntityAttributes()`
- `void applyEntityCollision(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `void attackTargetEntityWithCurrentItem(Entity targetEntity)`
- `protected void blockUsingShield(EntityLivingBase p_190629_1_)`
- `boolean canAttackPlayer(EntityPlayer other)`
- `boolean canEat(boolean ignoreHunger)`
- `boolean canHarvestBlock(IBlockState state)`
- `boolean canOpen(LockCode code)`
- `boolean canPlayerEdit(BlockPos pos, EnumFacing facing, ItemStack stack)`
- `protected boolean canTriggerWalking()`
- `boolean canUseCommandBlock()`
- `void closeScreen()`
- `protected CooldownTracker createCooldownTracker()`
- `protected void damageArmor(float damage)`
- `protected void damageEntity(DamageSource damageSrc, float damageAmount)`
- `protected void damageShield(float damage)`
- `protected void destroyVanishingCursedItems()`
- `void disableShield(boolean p_190777_1_)`
- `void dismountRidingEntity()`
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIChest(IInventory chestInventory)`
- `void displayGuiCommandBlock(TileEntityCommandBlock commandBlock)`
- `void displayGuiEditCommandCart(CommandBlockBaseLogic commandBlock)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `protected void doWaterSplashEffect()`
- `EntityItem dropItem(boolean dropAll)`
- `EntityItem dropItem(ItemStack itemStackIn, boolean unused)`
- `EntityItem dropItem(ItemStack droppedItem, boolean dropAround, boolean traceItem)`
- `ItemStack dropItemAndGetStack(EntityItem p_184816_1_)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `float getAbsorptionAmount()`
- `float getAIMoveSpeed()`
- `boolean getAlwaysRenderNameTagForRender()`
- `java.lang.Iterable<ItemStack> getArmorInventoryList()`
- `float getArmorVisibility()`
- `BlockPos getBedLocation()`
- `BlockPos getBedLocation(int dimension)` — A dimension aware version of getBedLocation.
- `float getBedOrientationInDegrees()`
- `static BlockPos getBedSpawnLocation(World worldIn, BlockPos bedLocation, boolean forceSpawn)`
- `<T> T getCapability(Capability<T> capability, EnumFacing facing)` — Retrieves the handler for the capability requested on the specific side.
- `float getCooldownPeriod()`
- `CooldownTracker getCooldownTracker()`
- `float getCooledAttackStrength(float adjustTicks)`
- `protected SoundEvent getDeathSound()`
- `float getDefaultEyeHeight()` — Returns the default eye height of the player
- `@Deprecated float getDigSpeed(IBlockState state)`
- `float getDigSpeed(IBlockState state, BlockPos pos)`
- `ITextComponent getDisplayName()`
- `java.lang.String getDisplayNameString()` — Get the currently computed display name, cached for efficiency.
- `protected int getExperiencePoints(EntityPlayer player)`
- `float getEyeHeight()`
- `protected SoundEvent getFallSound(int heightIn)`
- `protected int getFireImmuneTicks()`
- `FoodStats getFoodStats()`
- `GameProfile getGameProfile()`
- `java.lang.Iterable<ItemStack> getHeldEquipment()`
- `protected SoundEvent getHurtSound(DamageSource damageSourceIn)`
- `InventoryEnderChest getInventoryEnderChest()`
- `ItemStack getItemStackFromSlot(EntityEquipmentSlot slotIn)`
- `NBTTagCompound getLeftShoulderEntity()`
- `float getLuck()`
- `int getMaxInPortalTime()`
- `java.lang.String getName()`
- `static java.util.UUID getOfflineUUID(java.lang.String username)`
- `int getPortalCooldown()`
- `java.util.Collection<ITextComponent> getPrefixes()`
- `EnumHandSide getPrimaryHand()`
- `NBTTagCompound getRightShoulderEntity()`
- `int getScore()`
- `int getSleepTimer()`
- `SoundCategory getSoundCategory()`
- `int getSpawnDimension()`
- `protected SoundEvent getSplashSound()`
- `java.util.Collection<ITextComponent> getSuffixes()`
- `protected SoundEvent getSwimSound()`
- `Team getTeam()`
- `static java.util.UUID getUUID(GameProfile profile)`
- `Scoreboard getWorldScoreboard()`
- `int getXPSeed()`
- `double getYOffset()`
- `void handleStatusUpdate(byte id)`
- `boolean hasCapability(Capability<?> capability, EnumFacing facing)` — Determines if this object has support for the capability in question on the specific side.
- `boolean hasReducedDebug()`
- `boolean hasSpawnDimension()`
- `EnumActionResult interactOn(Entity p_190775_1_, EnumHand p_190775_2_)`
- `boolean isAllowEdit()`
- `abstract boolean isCreative()`
- `boolean isEntityInsideOpaqueBlock()`
- `boolean isInvisibleToPlayer(EntityPlayer player)`
- `protected boolean isMovementBlocked()`
- `protected boolean isPlayer()`
- `boolean isPlayerFullyAsleep()`
- `boolean isPlayerSleeping()`
- `boolean isPushedByWater()`
- `@Deprecated boolean isSpawnForced()`
- `boolean isSpawnForced(int dimension)` — A dimension aware version of isSpawnForced.
- `abstract boolean isSpectator()`
- `boolean isUser()`
- `boolean isWearing(EnumPlayerModelParts part)`
- `void jump()`
- `void onCriticalHit(Entity entityHit)`
- `void onDeath(DamageSource cause)`
- `void onEnchant(ItemStack enchantedItem, int cost)`
- `void onEnchantmentCritical(Entity entityHit)`
- `void onKillEntity(EntityLivingBase entityLivingIn)`
- `void onLivingUpdate()`
- `void onUpdate()`
- `void openBook(ItemStack stack, EnumHand hand)`
- `void openEditSign(TileEntitySign signTile)`
- `void openEditStructure(TileEntityStructure structure)`
- `void openGui(java.lang.Object mod, int modGuiId, World world, int x, int y, int z)` — Opens a GUI with this player, uses FML's IGuiHandler system.
- `void openGuiHorseInventory(AbstractHorse horse, IInventory inventoryIn)`
- `void playSound(SoundEvent soundIn, float volume, float pitch)`
- `void preparePlayerToSpawn()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void refreshDisplayName()` — Force the displayed name to refresh
- `static void registerFixesPlayer(DataFixer fixer)`
- `boolean replaceItemInInventory(int inventorySlot, ItemStack itemStackIn)`
- `void resetCooldown()`
- `void resetRecipes(java.util.List<IRecipe> p_192022_1_)`
- `void respawnPlayer()`
- `boolean sendCommandFeedback()`
- `void sendPlayerAbilities()`
- `void sendStatusMessage(ITextComponent chatComponent, boolean actionBar)`
- `void setAbsorptionAmount(float amount)`
- `void setDead()`
- `void setGameType(GameType gameType)`
- `void setInWeb()`
- `void setItemStackToSlot(EntityEquipmentSlot slotIn, ItemStack stack)`
- `protected void setLeftShoulderEntity(NBTTagCompound tag)`
- `void setPrimaryHand(EnumHandSide hand)`
- `void setReducedDebug(boolean reducedDebug)`
- `protected void setRightShoulderEntity(NBTTagCompound tag)`
- `void setScore(int scoreIn)`
- `void setSpawnChunk(BlockPos pos, boolean forced, int dimension)` — A dimension aware version of setSpawnChunk.
- `void setSpawnDimension(java.lang.Integer dimension)`
- `void setSpawnPoint(BlockPos pos, boolean forced)`
- `boolean shouldHeal()`
- `protected void spawnShoulderEntities()`
- `void spawnSweepParticles()`
- `void takeStat(StatBase stat)`
- `void travel(float strafe, float vertical, float forward)`
- `EntityPlayer.SleepResult trySleep(BlockPos bedLocation)`
- `void unlockRecipes(java.util.List<IRecipe> p_192021_1_)`
- `void unlockRecipes(ResourceLocation [] p_193102_1_)`
- `protected void updateEntityActionState()`
- `void updateRidden()`
- `protected void updateSize()`
- `void wakeUpPlayer(boolean immediately, boolean updateWorldFlag, boolean setSpawn)`
- `void writeEntityToNBT(NBTTagCompound compound)`
- `int xpBarCap()`

## Fields

- `BlockPos bedLocation`
- `float cameraYaw`
- `PlayerCapabilities capabilities`
- `double chasingPosX`
- `double chasingPosY`
- `double chasingPosZ`
- `protected InventoryEnderChest enderChest`
- `float experience`
- `int experienceLevel`
- `int experienceTotal`
- `float eyeHeight`
- `EntityFishHook fishEntity`
- `protected int flyToggleTimer`
- `protected FoodStats foodStats`
- `InventoryPlayer inventory`
- `Container inventoryContainer`
- `protected static DataParameter<NBTTagCompound> LEFT_SHOULDER_ENTITY`
- `protected static DataParameter<java.lang.Byte> MAIN_HAND`
- `Container openContainer`
- `static java.lang.String PERSISTED_NBT_TAG`
- `protected static DataParameter<java.lang.Byte> PLAYER_MODEL_FLAG`
- `float prevCameraYaw`
- `double prevChasingPosX`
- `double prevChasingPosY`
- `double prevChasingPosZ`
- `static IAttribute REACH_DISTANCE`
- `float renderOffsetX`
- `float renderOffsetY`
- `float renderOffsetZ`
- `protected static DataParameter<NBTTagCompound> RIGHT_SHOULDER_ENTITY`
- `protected boolean sleeping`
- `protected java.util.HashMap<java.lang.Integer, BlockPos> spawnChunkMap`
- `protected boolean spawnForced`
- `protected java.util.HashMap<java.lang.Integer, java.lang.Boolean> spawnForcedMap`
- `protected BlockPos spawnPos`
- `protected float speedInAir`
- `int xpCooldown`
- `protected int xpSeed`
