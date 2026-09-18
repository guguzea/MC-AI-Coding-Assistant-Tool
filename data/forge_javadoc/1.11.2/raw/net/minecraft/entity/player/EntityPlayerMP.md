---
title: "EntityPlayerMP"
description: "public class EntityPlayerMP extends EntityPlayer implements IContainerListener"
package: "net/minecraft/entity/player"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/player/EntityPlayerMP.html"
sourceType: javadoc
---

# EntityPlayerMP

## Class signature

```java
public class EntityPlayerMP extends EntityPlayer implements IContainerListener
```

## Constructors

- `public EntityPlayerMP( MinecraftServer server, WorldServer worldIn, com.mojang.authlib.GameProfile profile, PlayerInteractionManager interactionManagerIn)`

## Methods

- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public static void func_191522_a( DataFixer p_191522_0_)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void addExperienceLevel(int levels)`
- `public void removeExperienceLevel(int levels)`
- `public void addSelfToInternalCraftingInventory()`
- `public void sendEnterCombat()`
- `public void sendEndCombat()`
- `protected CooldownTracker createCooldownTracker()`
- `public void onUpdate()`
- `public void onUpdateEntity()`
- `protected void updateBiomesExplored()`
- `public void onDeath( DamageSource cause)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean canAttackPlayer( EntityPlayer other)`
- `@Nullable public Entity changeDimension(int dimensionIn)`
- `public boolean isSpectatedByPlayer( EntityPlayerMP player)`
- `public void onItemPickup( Entity entityIn, int quantity)`
- `public EntityPlayer.SleepResult trySleep( BlockPos bedLocation)`
- `public void wakeUpPlayer(boolean immediately, boolean updateWorldFlag, boolean setSpawn)`
- `public boolean startRiding( Entity entityIn, boolean force)`
- `public void dismountRidingEntity()`
- `public boolean isEntityInvulnerable( DamageSource source)`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `protected void frostWalk( BlockPos pos)`
- `public void handleFalling(double y, boolean onGroundIn)`
- `public void openEditSign( TileEntitySign signTile)`
- `public void getNextWindowId()`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void openGuiHorseInventory( AbstractHorse horse, IInventory inventoryIn)`
- `public void openBook( ItemStack stack, EnumHand hand)`
- `public void displayGuiCommandBlock( TileEntityCommandBlock commandBlock)`
- `public void sendSlotContents( Container containerToSend, int slotInd, ItemStack stack)`
- `public void sendContainerToPlayer( Container containerIn)`
- `public void updateCraftingInventory( Container containerToSend, NonNullList < ItemStack > itemsList)`
- `public void sendProgressBarUpdate( Container containerIn, int varToUpdate, int newValue)`
- `public void sendAllWindowProperties( Container containerIn, IInventory inventory)`
- `public void closeScreen()`
- `public void updateHeldItem()`
- `public void closeContainer()`
- `public void setEntityActionState(float strafe, float forward, boolean jumping, boolean sneaking)`
- `public boolean hasAchievement( Achievement achievementIn)`
- `public void addStat( StatBase stat, int amount)`
- `public void takeStat( StatBase stat)`
- `public void mountEntityAndWakeUp()`
- `public void setPlayerHealthUpdated()`
- `public void sendStatusMessage( ITextComponent chatComponent, boolean actionBar)`
- `protected void onItemUseFinish()`
- `public void clonePlayer( EntityPlayer oldPlayer, boolean respawnFromEnd)`
- `protected void onNewPotionEffect( PotionEffect id)`
- `protected void onChangedPotionEffect( PotionEffect id, boolean p_70695_2_)`
- `protected void onFinishedPotionEffect( PotionEffect effect)`
- `public void setPositionAndUpdate(double x, double y, double z)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public void sendPlayerAbilities()`
- `public WorldServer getServerWorld()`
- `public void setGameType( GameType gameType)`
- `public boolean isSpectator()`
- `public boolean isCreative()`
- `public void sendMessage( ITextComponent component)`
- `public boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `public java.lang.String getPlayerIP()`
- `public void handleClientSettings( CPacketClientSettings packetIn)`
- `public EntityPlayer.EnumChatVisibility getChatVisibility()`
- `public void loadResourcePack(java.lang.String url, java.lang.String hash)`
- `public BlockPos getPosition()`
- `public void markPlayerActive()`
- `public StatisticsManagerServer getStatFile()`
- `public void removeEntity( Entity entityIn)`
- `public void addEntity( Entity entityIn)`
- `protected void updatePotionMetadata()`
- `public Entity getSpectatingEntity()`
- `public void setSpectatingEntity( Entity entityToSpectate)`
- `protected void decrementTimeUntilPortal()`
- `public void attackTargetEntityWithCurrentItem( Entity targetEntity)`
- `public long getLastActiveTime()`
- `@Nullable public ITextComponent getTabListDisplayName()`
- `public void swingArm( EnumHand hand)`
- `public boolean isInvulnerableDimensionChange()`
- `public void clearInvulnerableDimensionChange()`
- `public void setElytraFlying()`
- `public void clearElytraFlying()`
