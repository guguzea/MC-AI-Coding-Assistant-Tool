---
title: "EntityLivingBase"
description: "Removes all potion effects that have curativeItem as a curative item for its effect"
package: "net/minecraft/entity/ai"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/EntityLivingBase.html"
sourceType: javadoc
---

# EntityLivingBase

## Class signature

```java
public abstract class EntityLivingBase extends Entity
```

## Constructors

- `public EntityLivingBase( World worldIn)`

## Methods

- `public void onKillCommand()`
- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `protected void updateFallState(double y, boolean onGroundIn, IBlockState state, BlockPos pos)`
- `public boolean canBreatheUnderwater()`
- `public void onEntityUpdate()`
- `protected void frostWalk( BlockPos pos)`
- `public boolean isChild()`
- `protected void onDeathUpdate()`
- `protected boolean canDropLoot()`
- `protected int decreaseAirSupply(int air)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `protected boolean isPlayer()`
- `public java.util.Random getRNG()`
- `public EntityLivingBase getAITarget()`
- `public int getRevengeTimer()`
- `public void setRevengeTarget(@Nullable EntityLivingBase livingBase)`
- `public EntityLivingBase getLastAttacker()`
- `public int getLastAttackerTime()`
- `public void setLastAttacker( Entity entityIn)`
- `public int getAge()`
- `protected void playEquipSound(@Nullable ItemStack stack)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `protected void updatePotionEffects()`
- `protected void updatePotionMetadata()`
- `public static boolean areAllPotionsAmbient(java.util.Collection< PotionEffect > potionEffects)`
- `protected void resetPotionEffectMetadata()`
- `public void clearActivePotions()`
- `public java.util.Collection< PotionEffect > getActivePotionEffects()`
- `public boolean isPotionActive( Potion potionIn)`
- `@Nullable public PotionEffect getActivePotionEffect( Potion potionIn)`
- `public void addPotionEffect( PotionEffect potioneffectIn)`
- `public boolean isPotionApplicable( PotionEffect potioneffectIn)`
- `public boolean isEntityUndead()`
- `@Nullable public PotionEffect removeActivePotionEffect(@Nullable Potion potioneffectin)`
- `public void removePotionEffect( Potion potionIn)`
- `protected void onNewPotionEffect( PotionEffect id)`
- `protected void onChangedPotionEffect( PotionEffect id, boolean p_70695_2_)`
- `protected void onFinishedPotionEffect( PotionEffect effect)`
- `public void heal(float healAmount)`
- `public final float getHealth()`
- `public void setHealth(float health)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `@Nullable public DamageSource getLastDamageSource()`
- `protected void playHurtSound( DamageSource source)`
- `public void renderBrokenItemStack( ItemStack stack)`
- `public void onDeath( DamageSource cause)`
- `protected void dropLoot(boolean wasRecentlyHit, int lootingModifier, DamageSource source)`
- `protected void dropEquipment(boolean wasRecentlyHit, int lootingModifier)`
- `public void knockBack( Entity entityIn, float strenght, double xRatio, double zRatio)`
- `@Nullable protected SoundEvent getHurtSound()`
- `@Nullable protected SoundEvent getDeathSound()`
- `protected SoundEvent getFallSound(int heightIn)`
- `protected void dropFewItems(boolean wasRecentlyHit, int lootingModifier)`
- `public boolean isOnLadder()`
- `public boolean isEntityAlive()`
- `public void fall(float distance, float damageMultiplier)`
- `public void performHurtAnimation()`
- `public int getTotalArmorValue()`
- `protected void damageArmor(float damage)`
- `protected void damageShield(float damage)`
- `protected float applyArmorCalculations( DamageSource source, float damage)`
- `protected float applyPotionDamageCalculations( DamageSource source, float damage)`
- `protected void damageEntity( DamageSource damageSrc, float damageAmount)`
- `public CombatTracker getCombatTracker()`
- `@Nullable public EntityLivingBase getAttackingEntity()`
- `public final float getMaxHealth()`
- `public final int getArrowCountInEntity()`
- `public final void setArrowCountInEntity(int count)`
- `public void swingArm( EnumHand hand)`
- `public void handleStatusUpdate(byte id)`
- `protected void kill()`
- `protected void updateArmSwingProgress()`
- `public IAttributeInstance getEntityAttribute( IAttribute attribute)`
- `public AbstractAttributeMap getAttributeMap()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `@Nullable public ItemStack getHeldItemMainhand()`
- `@Nullable public ItemStack getHeldItemOffhand()`
- `@Nullable public ItemStack getHeldItem( EnumHand hand)`
- `public void setHeldItem( EnumHand hand, @Nullable ItemStack stack)`
- `public abstract java.lang.Iterable< ItemStack > getArmorInventoryList()`
- `@Nullable public abstract ItemStack getItemStackFromSlot( EntityEquipmentSlot slotIn)`
- `public abstract void setItemStackToSlot( EntityEquipmentSlot slotIn, @Nullable ItemStack stack)`
- `public void setSprinting(boolean sprinting)`
- `protected float getSoundVolume()`
- `protected float getSoundPitch()`
- `protected boolean isMovementBlocked()`
- `public void dismountEntity( Entity entityIn)`
- `public boolean getAlwaysRenderNameTagForRender()`
- `protected float getJumpUpwardsMotion()`
- `protected void jump()`
- `protected void handleJumpWater()`
- `protected void handleJumpLava()`
- `protected float getWaterSlowDown()`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public float getAIMoveSpeed()`
- `public void setAIMoveSpeed(float speedIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean isPlayerSleeping()`
- `public void onUpdate()`
- `protected float updateDistance(float p_110146_1_, float p_110146_2_)`
- `public void onLivingUpdate()`
- `protected void updateEntityActionState()`
- `protected void collideWithNearbyEntities()`
- `protected void collideWithEntity( Entity entityIn)`
- `public void dismountRidingEntity()`
- `public void updateRidden()`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public void setJumping(boolean jumping)`
- `public void onItemPickup( Entity entityIn, int quantity)`
- `public boolean canEntityBeSeen( Entity entityIn)`
- `public Vec3d getLookVec()`
- `public Vec3d getLook(float partialTicks)`
- `public float getSwingProgress(float partialTickTime)`
- `public boolean isServerWorld()`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `protected void setBeenAttacked()`
- `public float getRotationYawHead()`

## Description

Removes all potion effects that have curativeItem as a curative item for its effect
