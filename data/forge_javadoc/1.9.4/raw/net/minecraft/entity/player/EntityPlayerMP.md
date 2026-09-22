---
title: "EntityPlayerMP"
description: "public class EntityPlayerMP extends EntityPlayer implements IContainerListener"
package: "net/minecraft/entity/player"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/player/EntityPlayerMP.html"
sourceType: javadoc
---

# EntityPlayerMP

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.player.EntityPlayer → net.minecraft.entity.player.EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements IContainerListener
```

## Constructors

- `EntityPlayerMP(MinecraftServer server, WorldServer worldIn, com.mojang.authlib.GameProfile profile, PlayerInteractionManager interactionManagerIn)`

## Methods

- `void addChatComponentMessage(ITextComponent chatComponent)`
- `void addChatMessage(ITextComponent component)`
- `void addEntity(Entity entityIn)`
- `void addExperienceLevel(int levels)`
- `void addSelfToInternalCraftingInventory()`
- `void addStat(StatBase stat, int amount)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `void attackTargetEntityWithCurrentItem(Entity targetEntity)`
- `boolean canAttackPlayer(EntityPlayer other)`
- `boolean canCommandSenderUseCommand(int permLevel, java.lang.String commandName)`
- `Entity changeDimension(int dimensionIn)`
- `void clearElytraFlying()`
- `void clearInvulnerableDimensionChange()`
- `void clonePlayer(EntityPlayer oldPlayer, boolean respawnFromEnd)`
- `void closeContainer()`
- `void closeScreen()`
- `protected CooldownTracker createCooldownTracker()`
- `protected void decrementTimeUntilPortal()`
- `void dismountRidingEntity()`
- `void displayGui(IInteractionObject guiOwner)`
- `void displayGUIChest(IInventory chestInventory)`
- `void displayGuiCommandBlock(TileEntityCommandBlock p_184824_1_)`
- `void displayVillagerTradeGui(IMerchant villager)`
- `protected void frostWalk(BlockPos pos)`
- `EntityPlayer.EnumChatVisibility getChatVisibility()`
- `long getLastActiveTime()`
- `void getNextWindowId()`
- `java.lang.String getPlayerIP()`
- `BlockPos getPosition()`
- `WorldServer getServerWorld()`
- `Entity getSpectatingEntity()`
- `StatisticsManagerServer getStatFile()`
- `ITextComponent getTabListDisplayName()`
- `void handleClientSettings(CPacketClientSettings packetIn)`
- `void handleFalling(double y, boolean onGroundIn)`
- `boolean hasAchievement(Achievement achievementIn)`
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
- `void onEnchantmentCritical(Entity entityHit)`
- `protected void onFinishedPotionEffect(PotionEffect effect)`
- `void onItemPickup(Entity entityIn, int quantity)`
- `protected void onItemUseFinish()`
- `protected void onNewPotionEffect(PotionEffect id)`
- `void onUpdate()`
- `void onUpdateEntity()`
- `void openBook(ItemStack stack, EnumHand hand)`
- `void openEditSign(TileEntitySign signTile)`
- `void openGuiHorseInventory(EntityHorse horse, IInventory inventoryIn)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void removeEntity(Entity entityIn)`
- `void removeExperienceLevel(int levels)`
- `void sendAllWindowProperties(Container containerIn, IInventory inventory)`
- `void sendContainerToPlayer(Container containerIn)`
- `void sendEndCombat()`
- `void sendEnterCombat()`
- `void sendPlayerAbilities()`
- `void sendProgressBarUpdate(Container containerIn, int varToUpdate, int newValue)`
- `void sendSlotContents(Container containerToSend, int slotInd, ItemStack stack)`
- `void setElytraFlying()`
- `void setEntityActionState(float strafe, float forward, boolean jumping, boolean sneaking)`
- `void setGameType(WorldSettings.GameType gameType)`
- `void setPlayerHealthUpdated()`
- `void setPositionAndUpdate(double x, double y, double z)`
- `void setSpectatingEntity(Entity entityToSpectate)`
- `boolean startRiding(Entity entityIn, boolean force)`
- `void swingArm(EnumHand hand)`
- `void takeStat(StatBase stat)`
- `EntityPlayer.SleepResult trySleep(BlockPos bedLocation)`
- `protected void updateBiomesExplored()`
- `void updateCraftingInventory(Container containerToSend, java.util.List<ItemStack> itemsList)`
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
- `boolean playerConqueredTheEnd`
