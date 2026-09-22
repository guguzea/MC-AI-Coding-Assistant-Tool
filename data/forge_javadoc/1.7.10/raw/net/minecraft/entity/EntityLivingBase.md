---
title: "EntityLivingBase"
description: "public abstract class EntityLivingBase extends Entity"
package: "net/minecraft/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/EntityLivingBase.html"
sourceType: javadoc
---

# EntityLivingBase

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase

## Class signature

```java
public abstract class EntityLivingBase extends Entity
```

## Constructors

- `EntityLivingBase(World p_i1594_1_)`

## Methods

- `void addPotionEffect(PotionEffect p_70690_1_)`
- `protected float applyArmorCalculations(DamageSource p_70655_1_, float p_70655_2_)`
- `protected void applyEntityAttributes()`
- `protected float applyPotionDamageCalculations(DamageSource p_70672_1_, float p_70672_2_)`
- `boolean attackEntityAsMob(Entity p_70652_1_)`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canBeCollidedWith()`
- `boolean canBePushed()`
- `boolean canBreatheUnderwater()`
- `boolean canEntityBeSeen(Entity p_70685_1_)`
- `void clearActivePotions()`
- `protected void collideWithEntity(Entity p_82167_1_)`
- `protected void collideWithNearbyEntities()`
- `protected void damageArmor(float p_70675_1_)`
- `protected void damageEntity(DamageSource p_70665_1_, float p_70665_2_)`
- `protected int decreaseAirSupply(int p_70682_1_)`
- `void dismountEntity(Entity p_110145_1_)`
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected void dropRareDrop(int p_70600_1_)`
- `protected void entityInit()`
- `protected void fall(float p_70069_1_)`
- `CombatTracker func_110142_aN()`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `int func_142015_aE()`
- `protected boolean func_146066_aG()`
- `protected java.lang.String func_146067_o(int p_146067_1_)`
- `void func_152111_bt()`
- `void func_152112_bu()`
- `EntityLivingBase func_94060_bK()`
- `float getAbsorptionAmount()`
- `PotionEffect getActivePotionEffect(Potion p_70660_1_)`
- `java.util.Collection getActivePotionEffects()`
- `int getAge()`
- `float getAIMoveSpeed()`
- `EntityLivingBase getAITarget()`
- `boolean getAlwaysRenderNameTagForRender()`
- `int getArrowCountInEntity()`
- `BaseAttributeMap getAttributeMap()`
- `EnumCreatureAttribute getCreatureAttribute()`
- `protected java.lang.String getDeathSound()`
- `IAttributeInstance getEntityAttribute(IAttribute p_110148_1_)`
- `abstract ItemStack getEquipmentInSlot(int p_71124_1_)`
- `protected int getExperiencePoints(EntityPlayer p_70693_1_)`
- `float getEyeHeight()`
- `float getHealth()`
- `abstract ItemStack getHeldItem()`
- `protected java.lang.String getHurtSound()`
- `IIcon getItemIcon(ItemStack p_70620_1_, int p_70620_2_)`
- `abstract ItemStack [] getLastActiveItems()`
- `EntityLivingBase getLastAttacker()`
- `int getLastAttackerTime()`
- `Vec3 getLook(float p_70676_1_)`
- `Vec3 getLookVec()`
- `float getMaxHealth()`
- `Vec3 getPosition(float p_70666_1_)`
- `java.util.Random getRNG()`
- `float getRotationYawHead()`
- `protected float getSoundPitch()`
- `protected float getSoundVolume()`
- `float getSwingProgress(float p_70678_1_)`
- `Team getTeam()`
- `int getTotalArmorValue()`
- `void handleHealthUpdate(byte p_70103_1_)`
- `void heal(float p_70691_1_)`
- `protected boolean isAIEnabled()`
- `boolean isChild()`
- `boolean isClientWorld()`
- `boolean isEntityAlive()`
- `boolean isEntityUndead()`
- `protected boolean isMovementBlocked()`
- `boolean isOnLadder()`
- `boolean isOnSameTeam(EntityLivingBase p_142014_1_)`
- `boolean isOnTeam(Team p_142012_1_)`
- `protected boolean isPlayer()`
- `boolean isPlayerSleeping()`
- `boolean isPotionActive(int p_82165_1_)`
- `boolean isPotionActive(Potion p_70644_1_)`
- `boolean isPotionApplicable(PotionEffect p_70687_1_)`
- `protected void jump()`
- `protected void kill()`
- `void knockBack(Entity p_70653_1_, float p_70653_2_, double p_70653_3_, double p_70653_5_)`
- `void moveEntityWithHeading(float p_70612_1_, float p_70612_2_)`
- `protected void onChangedPotionEffect(PotionEffect p_70695_1_, boolean p_70695_2_)`
- `void onDeath(DamageSource p_70645_1_)`
- `protected void onDeathUpdate()`
- `void onEntityUpdate()`
- `protected void onFinishedPotionEffect(PotionEffect p_70688_1_)`
- `void onItemPickup(Entity p_71001_1_, int p_71001_2_)`
- `void onLivingUpdate()`
- `protected void onNewPotionEffect(PotionEffect p_70670_1_)`
- `void onUpdate()`
- `void performHurtAnimation()`
- `MovingObjectPosition rayTrace(double p_70614_1_, float p_70614_3_)`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void removePotionEffect(int p_82170_1_)`
- `void removePotionEffectClient(int p_70618_1_)`
- `void renderBrokenItemStack(ItemStack p_70669_1_)`
- `void setAbsorptionAmount(float p_110149_1_)`
- `void setAIMoveSpeed(float p_70659_1_)`
- `void setArrowCountInEntity(int p_85034_1_)`
- `protected void setBeenAttacked()`
- `abstract void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `void setHealth(float p_70606_1_)`
- `void setJumping(boolean p_70637_1_)`
- `void setLastAttacker(Entity p_130011_1_)`
- `void setPositionAndRotation2(double p_70056_1_, double p_70056_3_, double p_70056_5_, float p_70056_7_, float p_70056_8_, int p_70056_9_)`
- `void setPositionAndUpdate(double p_70634_1_, double p_70634_3_, double p_70634_5_)`
- `void setRevengeTarget(EntityLivingBase p_70604_1_)`
- `void setRotationYawHead(float p_70034_1_)`
- `void setSprinting(boolean p_70031_1_)`
- `void swingItem()`
- `protected void updateAITasks()`
- `protected void updateAITick()`
- `protected void updateArmSwingProgress()`
- `protected void updateEntityActionState()`
- `protected void updateFallState(double p_70064_1_, boolean p_70064_3_)`
- `protected void updatePotionEffects()`
- `void updateRidden()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int arrowHitTimer`
- `float attackedAtYaw`
- `protected EntityPlayer attackingPlayer`
- `int attackTime`
- `float cameraPitch`
- `protected boolean dead`
- `int deathTime`
- `protected int entityAge`
- `protected float field_110154_aX`
- `protected float field_70741_aB`
- `protected float field_70763_ax`
- `protected float field_70764_aw`
- `protected float field_70768_au`
- `float field_70769_ao`
- `float field_70770_ap`
- `int hurtTime`
- `protected boolean isJumping`
- `boolean isSwingInProgress`
- `float jumpMovementFactor`
- `protected float lastDamage`
- `float limbSwing`
- `float limbSwingAmount`
- `int maxHurtResistantTime`
- `int maxHurtTime`
- `float moveForward`
- `float moveStrafing`
- `protected int newPosRotationIncrements`
- `protected double newPosX`
- `protected double newPosY`
- `protected double newPosZ`
- `protected double newRotationPitch`
- `protected double newRotationYaw`
- `float prevCameraPitch`
- `float prevHealth`
- `float prevLimbSwingAmount`
- `float prevRenderYawOffset`
- `float prevRotationYawHead`
- `float prevSwingProgress`
- `protected float randomYawVelocity`
- `protected int recentlyHit`
- `float renderYawOffset`
- `float rotationYawHead`
- `protected int scoreValue`
- `float swingProgress`
- `int swingProgressInt`
