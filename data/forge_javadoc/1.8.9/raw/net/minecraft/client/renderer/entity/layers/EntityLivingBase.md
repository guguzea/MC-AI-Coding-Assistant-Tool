---
title: "EntityLivingBase"
description: "The yaw at which this entity was last attacked from."
package: "net/minecraft/client/renderer/entity/layers"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityLivingBase.html"
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
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `public boolean canBreatheUnderwater()`
- `public void onEntityUpdate()`
- `public boolean isChild()`
- `protected void onDeathUpdate()`
- `protected boolean canDropLoot()`
- `protected int decreaseAirSupply(int p_70682_1_)`
- `protected int getExperiencePoints( EntityPlayer player)`
- `protected boolean isPlayer()`
- `public java.util.Random getRNG()`
- `public EntityLivingBase getAITarget()`
- `public int getRevengeTimer()`
- `public void setRevengeTarget( EntityLivingBase livingBase)`
- `public EntityLivingBase getLastAttacker()`
- `public int getLastAttackerTime()`
- `public void setLastAttacker( Entity entityIn)`
- `public int getAge()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected void updatePotionEffects()`
- `protected void updatePotionMetadata()`
- `protected void resetPotionEffectMetadata()`
- `public void clearActivePotions()`
- `public java.util.Collection< PotionEffect > getActivePotionEffects()`
- `public boolean isPotionActive(int potionId)`
- `public boolean isPotionActive( Potion potionIn)`
- `public PotionEffect getActivePotionEffect( Potion potionIn)`
- `public void addPotionEffect( PotionEffect potioneffectIn)`
- `public boolean isPotionApplicable( PotionEffect potioneffectIn)`
- `public boolean isEntityUndead()`
- `public void removePotionEffectClient(int potionId)`
- `public void removePotionEffect(int potionId)`
- `protected void onNewPotionEffect( PotionEffect id)`
- `protected void onChangedPotionEffect( PotionEffect id, boolean p_70695_2_)`
- `protected void onFinishedPotionEffect( PotionEffect p_70688_1_)`
- `public void heal(float healAmount)`
- `public final float getHealth()`
- `public void setHealth(float health)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void renderBrokenItemStack( ItemStack stack)`
- `public void onDeath( DamageSource cause)`
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)`
- `public void knockBack( Entity entityIn, float p_70653_2_, double p_70653_3_, double p_70653_5_)`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void addRandomDrop()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public boolean isOnLadder()`
- `public boolean isEntityAlive()`
- `public void fall(float distance, float damageMultiplier)`
- `protected java.lang.String getFallSoundString(int damageValue)`
- `public void performHurtAnimation()`
- `public int getTotalArmorValue()`
- `protected void damageArmor(float p_70675_1_)`
- `protected float applyArmorCalculations( DamageSource source, float damage)`
- `protected float applyPotionDamageCalculations( DamageSource source, float damage)`
- `protected void damageEntity( DamageSource damageSrc, float damageAmount)`
- `public CombatTracker getCombatTracker()`
- `public EntityLivingBase func_94060_bK()`
- `public final float getMaxHealth()`
- `public final int getArrowCountInEntity()`
- `public final void setArrowCountInEntity(int count)`
- `public void swingItem()`
- `public void handleStatusUpdate(byte id)`
- `protected void kill()`
- `protected void updateArmSwingProgress()`
- `public IAttributeInstance getEntityAttribute( IAttribute attribute)`
- `public BaseAttributeMap getAttributeMap()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public abstract ItemStack getHeldItem()`
- `public abstract ItemStack getEquipmentInSlot(int slotIn)`
- `public abstract ItemStack getCurrentArmor(int slotIn)`
- `public abstract void setCurrentItemOrArmor(int slotIn, ItemStack stack)`
- `public void setSprinting(boolean sprinting)`
- `public abstract ItemStack [] getInventory()`
- `protected float getSoundVolume()`
- `protected float getSoundPitch()`
- `protected boolean isMovementBlocked()`
- `public void dismountEntity( Entity p_110145_1_)`
- `public boolean getAlwaysRenderNameTagForRender()`
- `protected float getJumpUpwardsMotion()`
- `protected void jump()`
- `protected void updateAITick()`
- `protected void handleJumpLava()`
- `public void moveEntityWithHeading(float strafe, float forward)`
- `public float getAIMoveSpeed()`
- `public void setAIMoveSpeed(float speedIn)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean isPlayerSleeping()`
- `public void onUpdate()`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `public void onLivingUpdate()`
- `protected void updateEntityActionState()`
- `protected void collideWithNearbyEntities()`
- `protected void collideWithEntity( Entity p_82167_1_)`
- `public void mountEntity( Entity entityIn)`
- `public void updateRidden()`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public void setJumping(boolean p_70637_1_)`
- `public void onItemPickup( Entity p_71001_1_, int p_71001_2_)`
- `public boolean canEntityBeSeen( Entity entityIn)`
- `public Vec3 getLookVec()`
- `public Vec3 getLook(float partialTicks)`
- `public float getSwingProgress(float partialTickTime)`
- `public boolean isServerWorld()`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `protected void setBeenAttacked()`
- `public float getRotationYawHead()`
- `public void setRotationYawHead(float rotation)`
- `public void func_181013_g(float p_181013_1_)`
- `public float getAbsorptionAmount()`
- `public void setAbsorptionAmount(float amount)`
- `public Team getTeam()`
- `public boolean isOnSameTeam( EntityLivingBase otherEntity)`
- `public boolean isOnTeam( Team p_142012_1_)`
- `public void sendEnterCombat()`

## Description

The yaw at which this entity was last attacked from.
