---
title: "EntityPlayerMP"
description: "public class EntityPlayerMP extends EntityPlayer implements IContainerListener"
package: "net/minecraft/entity/player"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/player/EntityPlayerMP.html"
sourceType: javadoc
---

# EntityPlayerMP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements IContainerListener
```

## Constructors

- `EntityPlayerMP(MinecraftServer server, WorldServer worldIn, GameProfile profile, PlayerInteractionManager interactionManagerIn)`

## Methods

- `void addEntity(Entity entityIn)`
- `void addExperienceLevel(int levels)`
- `void addSelfToInternalCraftingInventory()`
- `void addStat(StatBase stat, int amount)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `void attackTargetEntityWithCurrentItem(Entity targetEntity)`
- `void awardKillScore(Entity p_191956_1_, int p_191956_2_, DamageSource p_191956_3_)`
- `boolean canAttackPlayer(EntityPlayer other)`
- `boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `Entity changeDimension(int dimensionIn, ITeleporter teleporter)`
- `void clearElytraFlying()`
- `void clearInvulnerableDimensionChange()`
- `void closeContainer()`
- `void closeScreen()`
- `void copyFrom(EntityPlayerMP that, boolean keepEverything)`
- `protected CooldownTracker createCooldownTracker()`
- `protected void decrementTimeUntilPortal()`
- `void dismountRidingEntity()`
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIChest(IInventory chestInventory)`
- `void displayGuiCommandBlock(TileEntityCommandBlock commandBlock)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `protected void frostWalk(BlockPos pos)`
- `PlayerAdvancements getAdvancements()`
- `EntityPlayer.EnumChatVisibility getChatVisibility()`
- `Vec3d getEnteredNetherPosition()`
- `long getLastActiveTime()`
- `void getNextWindowId()`
- `java.lang.String getPlayerIP()`
- `BlockPos getPosition()`
- `RecipeBookServer getRecipeBook()`
- `WorldServer getServerWorld()`
- `Entity getSpectatingEntity()`
- `StatisticsManagerServer getStatFile()`
- `ITextComponent getTabListDisplayName()`
- `void handleClientSettings(CPacketClientSettings packetIn)`
- `void handleFalling(double y, boolean onGroundIn)`
- `boolean hasDisconnected()`
- `boolean isCreative()`
- `boolean isEntityInvulnerable(DamageSource source)`
- `boolean isInvulnerableDimensionChange()`
- `boolean isSpectatedByPlayer(EntityPlayerMP player)`
- `boolean isSpectator()`
- `void loadResourcePack(java.lang.String url, java.lang.String hash)`
- `void markPlayerActive()`
- `void mountEntityAndWakeUp()`
- `protected void onChangedPotionEffect(PotionEffect id, boolean p_70695_2_)`
- `void onCriticalHit(Entity entityHit)`
- `void onDeath(DamageSource cause)`
- `void onEnchant(ItemStack enchantedItem, int cost)`
- `void onEnchantmentCritical(Entity entityHit)`
- `protected void onFinishedPotionEffect(PotionEffect effect)`
- `protected void onInsideBlock(IBlockState p_191955_1_)`
- `void onItemPickup(Entity entityIn, int quantity)`
- `protected void onItemUseFinish()`
- `protected void onNewPotionEffect(PotionEffect id)`
- `void onUpdate()`
- `void onUpdateEntity()`
- `void openBook(ItemStack stack, EnumHand hand)`
- `void openEditSign(TileEntitySign signTile)`
- `void openGuiHorseInventory(AbstractHorse horse, IInventory inventoryIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesPlayerMP(DataFixer p_191522_0_)`
- `void removeEntity(Entity entityIn)`
- `void resetRecipes(java.util.List<IRecipe> p_192022_1_)`
- `void sendAllContents(Container containerToSend, NonNullList<ItemStack> itemsList)`
- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendContainerToPlayer(Container containerIn)`
- `void sendEndCombat()`
- `void sendEnterCombat()`
- `void sendMessage(ITextComponent component)`
- `void sendPlayerAbilities()`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void sendStatusMessage(ITextComponent chatComponent, boolean actionBar)`
- `void sendWindowProperty(Container containerIn, int varToUpdate, int newValue)`
- `void setElytraFlying()`
- `void setEntityActionState(float strafe, float forward, boolean jumping, boolean sneaking)`
- `void setGameType(GameType gameType)`
- `void setPlayerHealthUpdated()`
- `void setPositionAndUpdate(double x, double y, double z)`
- `void setSpectatingEntity(Entity entityToSpectate)`
- `boolean startRiding(Entity entityIn, boolean force)`
- `void swingArm(EnumHand hand)`
- `void takeStat(StatBase stat)`
- `EntityPlayer.SleepResult trySleep(BlockPos bedLocation)`
- `void unlockRecipes(java.util.List<IRecipe> p_192021_1_)`
- `void unlockRecipes(ResourceLocation [] p_193102_1_)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `void updateHeldItem()`
- `protected void updatePotionMetadata()`
- `void wakeUpPlayer(boolean immediately, boolean updateWorldFlag, boolean setSpawn)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `NetHandlerPlayServer connection`
- `int currentWindowId`
- `PlayerInteractionManager interactionManager`
- `boolean isChangingQuantityOnly`
- `double managedPosX`
- `double managedPosZ`
- `MinecraftServer mcServer`
- `int ping`
- `boolean queuedEndExit`
