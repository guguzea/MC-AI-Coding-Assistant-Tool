---
title: "EntityPlayer"
description: "The player's capabilities."
package: "net/minecraft/entity/player"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/player/EntityPlayer.html"
sourceType: javadoc
---

# EntityPlayer

## Class signature

```java
public abstract class EntityPlayer extends EntityLivingBase
```

## Constructors

- `public EntityPlayer( World worldIn, GameProfile gameProfileIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public ItemStack getItemInUse()`
- `public int getItemInUseCount()`
- `public boolean isUsingItem()`
- `public int getItemInUseDuration()`
- `public void stopUsingItem()`
- `public void clearItemInUse()`
- `public boolean isBlocking()`
- `public void onUpdate()`
- `public int getMaxInPortalTime()`
- `protected java.lang.String getSwimSound()`
- `protected java.lang.String getSplashSound()`
- `public int getPortalCooldown()`
- `public void playSound(java.lang.String name, float volume, float pitch)`
- `protected void updateItemUse( ItemStack itemStackIn, int p_71010_2_)`
- `protected void onItemUseFinish()`
- `public void handleStatusUpdate(byte id)`
- `protected boolean isMovementBlocked()`
- `public void closeScreen()`
- `public void updateRidden()`
- `public void preparePlayerToSpawn()`
- `protected void updateEntityActionState()`
- `public void onLivingUpdate()`
- `public int getScore()`
- `public void setScore(int p_85040_1_)`
- `public void addScore(int p_85039_1_)`
- `public void onDeath( DamageSource cause)`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public void addToPlayerScore( Entity entityIn, int amount)`
- `public EntityItem dropOneItem(boolean dropAll)`
- `public EntityItem dropPlayerItemWithRandomChoice( ItemStack itemStackIn, boolean unused)`
- `public EntityItem dropItem( ItemStack droppedItem, boolean dropAround, boolean traceItem)`
- `public void joinEntityItemWithWorld( EntityItem itemIn)`
- `@Deprecated public float getToolDigEfficiency( Block p_180471_1_)`
- `public float getBreakSpeed( IBlockState state, BlockPos pos)`
- `public boolean canHarvestBlock( Block blockToHarvest)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean canAttackPlayer( EntityPlayer other)`
- `protected void damageArmor(float p_70675_1_)`
- `public int getTotalArmorValue()`
- `public float getArmorVisibility()`
- `protected void damageEntity( DamageSource damageSrc, float damageAmount)`
- `public void openEditSign( TileEntitySign signTile)`
- `public void openEditCommandBlock( CommandBlockLogic cmdBlockLogic)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void displayGUIHorse( EntityHorse horse, IInventory horseInventory)`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void displayGUIBook( ItemStack bookStack)`
- `public boolean interactWith( Entity targetEntity)`
- `public ItemStack getCurrentEquippedItem()`
- `public void destroyCurrentEquippedItem()`
- `public double getYOffset()`
- `public void attackTargetEntityWithCurrentItem( Entity targetEntity)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public void respawnPlayer()`
- `public void setDead()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean isUser()`
- `public GameProfile getGameProfile()`
- `public EntityPlayer.EnumStatus trySleep( BlockPos bedLocation)`
- `public void wakeUpPlayer(boolean p_70999_1_, boolean updateWorldFlag, boolean setSpawn)`
- `public static BlockPos getBedSpawnLocation( World worldIn, BlockPos bedLocation, boolean forceSpawn)`
- `public float getBedOrientationInDegrees()`
- `public boolean isPlayerSleeping()`
- `public boolean isPlayerFullyAsleep()`
- `public int getSleepTimer()`
- `public void addChatComponentMessage( IChatComponent chatComponent)`
- `public BlockPos getBedLocation()`
- `@Deprecated public boolean isSpawnForced()`
- `public void setSpawnPoint( BlockPos pos, boolean forced)`
- `public void triggerAchievement( StatBase achievementIn)`
- `public void addStat( StatBase stat, int amount)`
- `public void func_175145_a( StatBase p_175145_1_)`
- `public void jump()`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public float getAIMoveSpeed()`
- `public void addMovementStat(double p_71000_1_, double p_71000_3_, double p_71000_5_)`
- `public void fall(float distance, float damageMultiplier)`
- `protected void resetHeight()`
- `protected java.lang.String getFallSoundString(int damageValue)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public void setInWeb()`
- `public ItemStack getCurrentArmor(int slotIn)`
- `public void addExperience(int amount)`
- `public int getXPSeed()`
- `public void removeExperienceLevel(int levels)`
- `public void addExperienceLevel(int levels)`
- `public int xpBarCap()`
- `public void addExhaustion(float p_71020_1_)`
- `public FoodStats getFoodStats()`
- `public boolean canEat(boolean ignoreHunger)`
- `public boolean shouldHeal()`
- `public void setItemInUse( ItemStack stack, int duration)`
- `public boolean isAllowEdit()`
- `public boolean canPlayerEdit( BlockPos p_175151_1_, EnumFacing p_175151_2_, ItemStack p_175151_3_)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `protected boolean isPlayer()`
- `public boolean getAlwaysRenderNameTagForRender()`
- `public void clonePlayer( EntityPlayer oldPlayer, boolean respawnFromEnd)`
- `protected boolean canTriggerWalking()`
- `public void sendPlayerAbilities()`
- `public void setGameType( WorldSettings.GameType gameType)`
- `public java.lang.String getName()`
- `public InventoryEnderChest getInventoryEnderChest()`
- `public ItemStack getEquipmentInSlot(int slotIn)`
- `public ItemStack getHeldItem()`
- `public void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public boolean isInvisibleToPlayer( EntityPlayer player)`
- `public abstract boolean isSpectator()`
- `public ItemStack [] getInventory()`
- `public boolean isPushedByWater()`
- `public Scoreboard getWorldScoreboard()`
- `public Team getTeam()`
- `public IChatComponent getDisplayName()`

## Description

The player's capabilities.
