---
title: "EntityPlayer"
description: "Add a prefix to the player's username in chat"
package: "net/minecraft/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/player/EntityPlayer.html"
sourceType: javadoc
---

# EntityPlayer

## Class signature

```java
public abstract class EntityPlayer extends EntityLivingBase
```

## Constructors

- `public EntityPlayer( World worldIn, com.mojang.authlib.GameProfile gameProfileIn)`

## Methods

- `protected CooldownTracker createCooldownTracker()`
- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public void onUpdate()`
- `protected void updateSize()`
- `public int getMaxInPortalTime()`
- `protected SoundEvent getSwimSound()`
- `protected SoundEvent getSplashSound()`
- `public int getPortalCooldown()`
- `public void playSound( SoundEvent soundIn, float volume, float pitch)`
- `public SoundCategory getSoundCategory()`
- `public void handleStatusUpdate(byte id)`
- `protected boolean isMovementBlocked()`
- `public void closeScreen()`
- `public void updateRidden()`
- `public void preparePlayerToSpawn()`
- `protected void updateEntityActionState()`
- `public void onLivingUpdate()`
- `public int getScore()`
- `public void setScore(int scoreIn)`
- `public void addScore(int scoreIn)`
- `public void onDeath( DamageSource cause)`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void addToPlayerScore( Entity entityIn, int amount)`
- `@Nullable public EntityItem dropItem(boolean dropAll)`
- `@Nullable public EntityItem dropItem(@Nullable ItemStack itemStackIn, boolean unused)`
- `@Nullable public EntityItem dropItem(@Nullable ItemStack droppedItem, boolean dropAround, boolean traceItem)`
- `@Nullable public ItemStack dropItemAndGetStack( EntityItem p_184816_1_)`
- `@Deprecated public float getDigSpeed( IBlockState state)`
- `public float getDigSpeed( IBlockState state, BlockPos pos)`
- `public boolean canHarvestBlock( IBlockState state)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean canAttackPlayer( EntityPlayer other)`
- `protected void damageArmor(float damage)`
- `protected void damageShield(float damage)`
- `public float getArmorVisibility()`
- `protected void damageEntity( DamageSource damageSrc, float damageAmount)`
- `public void openEditSign( TileEntitySign signTile)`
- `public void displayGuiEditCommandCart( CommandBlockBaseLogic p_184809_1_)`
- `public void displayGuiCommandBlock( TileEntityCommandBlock p_184824_1_)`
- `public void displayVillagerTradeGui( IMerchant villager)`
- `public void displayGUIChest( IInventory chestInventory)`
- `public void openGuiHorseInventory( EntityHorse horse, IInventory inventoryIn)`
- `public void displayGui( IInteractionObject guiOwner)`
- `public void openBook( ItemStack stack, EnumHand hand)`
- `public EnumActionResult interact( Entity entityIn, @Nullable ItemStack stack, EnumHand hand)`
- `public double getYOffset()`
- `public void dismountRidingEntity()`
- `public void attackTargetEntityWithCurrentItem( Entity targetEntity)`
- `public void onCriticalHit( Entity entityHit)`
- `public void onEnchantmentCritical( Entity entityHit)`
- `public void spawnSweepParticles()`
- `public void respawnPlayer()`
- `public void setDead()`
- `public boolean isEntityInsideOpaqueBlock()`
- `public boolean isUser()`
- `public com.mojang.authlib.GameProfile getGameProfile()`
- `public EntityPlayer.SleepResult trySleep( BlockPos bedLocation)`
- `public void wakeUpPlayer(boolean immediately, boolean updateWorldFlag, boolean setSpawn)`
- `@Nullable public static BlockPos getBedSpawnLocation( World worldIn, BlockPos bedLocation, boolean forceSpawn)`
- `public float getBedOrientationInDegrees()`
- `public boolean isPlayerSleeping()`
- `public boolean isPlayerFullyAsleep()`
- `public int getSleepTimer()`
- `public void addChatComponentMessage( ITextComponent chatComponent)`
- `public BlockPos getBedLocation()`
- `@Deprecated public boolean isSpawnForced()`
- `public void setSpawnPoint( BlockPos pos, boolean forced)`
- `public boolean hasAchievement( Achievement achievementIn)`
- `public void addStat( StatBase stat)`
- `public void addStat( StatBase stat, int amount)`
- `public void takeStat( StatBase stat)`
- `public void jump()`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public float getAIMoveSpeed()`
- `public void addMovementStat(double p_71000_1_, double p_71000_3_, double p_71000_5_)`
- `public void fall(float distance, float damageMultiplier)`
- `protected void resetHeight()`
- `protected SoundEvent getFallSound(int heightIn)`
- `public void onKillEntity( EntityLivingBase entityLivingIn)`
- `public void setInWeb()`
- `public void addExperience(int amount)`
- `public int getXPSeed()`
- `public void removeExperienceLevel(int levels)`
- `public void addExperienceLevel(int levels)`
- `public int xpBarCap()`
- `public void addExhaustion(float exhaustion)`
- `public FoodStats getFoodStats()`
- `public boolean canEat(boolean ignoreHunger)`
- `public boolean shouldHeal()`
- `public boolean isAllowEdit()`
- `public boolean canPlayerEdit( BlockPos pos, EnumFacing facing, @Nullable ItemStack stack)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `protected boolean isPlayer()`
- `public boolean getAlwaysRenderNameTagForRender()`
- `public void clonePlayer( EntityPlayer oldPlayer, boolean respawnFromEnd)`
- `protected boolean canTriggerWalking()`
- `public void sendPlayerAbilities()`
- `public void setGameType( WorldSettings.GameType gameType)`
- `public java.lang.String getName()`
- `public InventoryEnderChest getInventoryEnderChest()`
- `@Nullable public ItemStack getItemStackFromSlot( EntityEquipmentSlot slotIn)`
- `public void setItemStackToSlot( EntityEquipmentSlot slotIn, @Nullable ItemStack stack)`
- `public java.lang.Iterable< ItemStack > getHeldEquipment()`
- `public java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `public boolean isInvisibleToPlayer( EntityPlayer player)`
- `public abstract boolean isSpectator()`
- `public abstract boolean isCreative()`
- `public boolean isPushedByWater()`
- `public Scoreboard getWorldScoreboard()`
- `public Team getTeam()`
- `public ITextComponent getDisplayName()`
- `public float getEyeHeight()`
- `public void setAbsorptionAmount(float amount)`
- `public float getAbsorptionAmount()`
- `public static java.util.UUID getUUID(com.mojang.authlib.GameProfile profile)`
- `public static java.util.UUID getOfflineUUID(java.lang.String username)`

## Description

Add a prefix to the player's username in chat
