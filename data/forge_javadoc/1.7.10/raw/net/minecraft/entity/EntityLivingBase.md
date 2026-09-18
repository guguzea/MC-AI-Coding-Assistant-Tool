---
title: "EntityLivingBase"
description: "public abstract class EntityLivingBase extends Entity"
package: "net/minecraft/entity"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/EntityLivingBase.html"
sourceType: javadoc
---

# EntityLivingBase

## Class signature

```java
public abstract class EntityLivingBase extends Entity
```

## Constructors

- `public EntityLivingBase( World p_i1594_1_)`

## Methods

- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `protected void updateFallState(double p_70064_1_, boolean p_70064_3_)`
- `public boolean canBreatheUnderwater()`
- `public void onEntityUpdate()`
- `public boolean isChild()`
- `protected void onDeathUpdate()`
- `protected boolean func_146066_aG()`
- `protected int decreaseAirSupply(int p_70682_1_)`
- `protected int getExperiencePoints( EntityPlayer p_70693_1_)`
- `protected boolean isPlayer()`
- `public java.util.Random getRNG()`
- `public EntityLivingBase getAITarget()`
- `public int func_142015_aE()`
- `public void setRevengeTarget( EntityLivingBase p_70604_1_)`
- `public EntityLivingBase getLastAttacker()`
- `public int getLastAttackerTime()`
- `public void setLastAttacker( Entity p_130011_1_)`
- `public int getAge()`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `protected void updatePotionEffects()`
- `public void clearActivePotions()`
- `public java.util.Collection getActivePotionEffects()`
- `public boolean isPotionActive(int p_82165_1_)`
- `public boolean isPotionActive( Potion p_70644_1_)`
- `public PotionEffect getActivePotionEffect( Potion p_70660_1_)`
- `public void addPotionEffect( PotionEffect p_70690_1_)`
- `public boolean isPotionApplicable( PotionEffect p_70687_1_)`
- `public boolean isEntityUndead()`
- `public void removePotionEffectClient(int p_70618_1_)`
- `public void removePotionEffect(int p_82170_1_)`
- `protected void onNewPotionEffect( PotionEffect p_70670_1_)`
- `protected void onChangedPotionEffect( PotionEffect p_70695_1_, boolean p_70695_2_)`
- `protected void onFinishedPotionEffect( PotionEffect p_70688_1_)`
- `public void heal(float p_70691_1_)`
- `public final float getHealth()`
- `public void setHealth(float p_70606_1_)`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `public void renderBrokenItemStack( ItemStack p_70669_1_)`
- `public void onDeath( DamageSource p_70645_1_)`
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)`
- `public void knockBack( Entity p_70653_1_, float p_70653_2_, double p_70653_3_, double p_70653_5_)`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void dropRareDrop(int p_70600_1_)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public boolean isOnLadder()`
- `public boolean isEntityAlive()`
- `protected void fall(float p_70069_1_)`
- `protected java.lang.String func_146067_o(int p_146067_1_)`
- `public void performHurtAnimation()`
- `public int getTotalArmorValue()`
- `protected void damageArmor(float p_70675_1_)`
- `protected float applyArmorCalculations( DamageSource p_70655_1_, float p_70655_2_)`
- `protected float applyPotionDamageCalculations( DamageSource p_70672_1_, float p_70672_2_)`
- `protected void damageEntity( DamageSource p_70665_1_, float p_70665_2_)`
- `public CombatTracker func_110142_aN()`
- `public EntityLivingBase func_94060_bK()`
- `public final float getMaxHealth()`
- `public final int getArrowCountInEntity()`
- `public final void setArrowCountInEntity(int p_85034_1_)`
- `public void swingItem()`
- `public void handleHealthUpdate(byte p_70103_1_)`
- `protected void kill()`
- `protected void updateArmSwingProgress()`
- `public IAttributeInstance getEntityAttribute( IAttribute p_110148_1_)`
- `public BaseAttributeMap getAttributeMap()`
- `public EnumCreatureAttribute getCreatureAttribute()`
- `public abstract ItemStack getHeldItem()`
- `public abstract ItemStack getEquipmentInSlot(int p_71124_1_)`
- `public abstract void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `public void setSprinting(boolean p_70031_1_)`
- `public abstract ItemStack [] getLastActiveItems()`
- `protected float getSoundVolume()`
- `protected float getSoundPitch()`
- `protected boolean isMovementBlocked()`
- `public void setPositionAndUpdate(double p_70634_1_, double p_70634_3_, double p_70634_5_)`
- `public void dismountEntity( Entity p_110145_1_)`
- `public boolean getAlwaysRenderNameTagForRender()`
- `public IIcon getItemIcon( ItemStack p_70620_1_, int p_70620_2_)`
- `protected void jump()`
- `public void moveEntityWithHeading(float p_70612_1_, float p_70612_2_)`
- `protected boolean isAIEnabled()`
- `public float getAIMoveSpeed()`
- `public void setAIMoveSpeed(float p_70659_1_)`
- `public boolean attackEntityAsMob( Entity p_70652_1_)`
- `public boolean isPlayerSleeping()`
- `public void onUpdate()`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `public void onLivingUpdate()`
- `protected void updateAITasks()`
- `protected void collideWithNearbyEntities()`
- `protected void collideWithEntity( Entity p_82167_1_)`
- `public void updateRidden()`
- `public void setPositionAndRotation2(double p_70056_1_, double p_70056_3_, double p_70056_5_, float p_70056_7_, float p_70056_8_, int p_70056_9_)`
- `protected void updateAITick()`
- `protected void updateEntityActionState()`
- `public void setJumping(boolean p_70637_1_)`
- `public void onItemPickup( Entity p_71001_1_, int p_71001_2_)`
- `public boolean canEntityBeSeen( Entity p_70685_1_)`
- `public Vec3 getLookVec()`
- `public Vec3 getLook(float p_70676_1_)`
- `public float getSwingProgress(float p_70678_1_)`
- `public Vec3 getPosition(float p_70666_1_)`
- `public MovingObjectPosition rayTrace(double p_70614_1_, float p_70614_3_)`
- `public boolean isClientWorld()`
- `public boolean canBeCollidedWith()`
- `public boolean canBePushed()`
- `public float getEyeHeight()`
- `protected void setBeenAttacked()`
- `public float getRotationYawHead()`
- `public void setRotationYawHead(float p_70034_1_)`
- `public float getAbsorptionAmount()`
- `public void setAbsorptionAmount(float p_110149_1_)`
- `public Team getTeam()`
- `public boolean isOnSameTeam( EntityLivingBase p_142014_1_)`
- `public boolean isOnTeam( Team p_142012_1_)`
- `public void func_152111_bt()`
- `public void func_152112_bu()`
