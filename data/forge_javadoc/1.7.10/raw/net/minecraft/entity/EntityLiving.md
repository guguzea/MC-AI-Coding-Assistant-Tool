---
title: "EntityLiving"
description: "public abstract class EntityLiving extends EntityLivingBase"
package: "net/minecraft/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/EntityLiving.html"
sourceType: javadoc
---

# EntityLiving

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving

## Class signature

```java
public abstract class EntityLiving extends EntityLivingBase
```

## Constructors

- `EntityLiving(World p_i1595_1_)`

## Methods

- `protected void addRandomArmor()`
- `boolean allowLeashing()`
- `protected void applyEntityAttributes()`
- `boolean canAttackClass(java.lang.Class p_70686_1_)`
- `boolean canBeSteered()`
- `protected boolean canDespawn()`
- `boolean canPickUpLoot()`
- `void clearLeashed(boolean p_110160_1_, boolean p_110160_2_)`
- `protected void despawnEntity()`
- `protected void dropEquipment(boolean p_82160_1_, int p_82160_2_)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `void eatGrassBonus()`
- `protected void enchantEquipment()`
- `protected void entityInit()`
- `void faceEntity(Entity p_70625_1_, float p_70625_2_, float p_70625_3_)`
- `protected float func_110146_f(float p_110146_1_, float p_110146_2_)`
- `void func_110163_bv()`
- `ItemStack func_130225_q(int p_130225_1_)`
- `boolean getAlwaysRenderNameTag()`
- `boolean getAlwaysRenderNameTagForRender()`
- `static Item getArmorItemForSlot(int p_82161_0_, int p_82161_1_)`
- `static int getArmorPosition(ItemStack p_82159_0_)`
- `EntityLivingBase getAttackTarget()`
- `boolean getCanSpawnHere()`
- `java.lang.String getCommandSenderName()`
- `java.lang.String getCustomNameTag()`
- `protected Item getDropItem()`
- `EntitySenses getEntitySenses()`
- `ItemStack getEquipmentInSlot(int p_71124_1_)`
- `protected int getExperiencePoints(EntityPlayer p_70693_1_)`
- `ItemStack getHeldItem()`
- `EntityJumpHelper getJumpHelper()`
- `ItemStack [] getLastActiveItems()`
- `boolean getLeashed()`
- `Entity getLeashedToEntity()`
- `protected java.lang.String getLivingSound()`
- `EntityLookHelper getLookHelper()`
- `int getMaxSafePointTries()`
- `int getMaxSpawnedInChunk()`
- `EntityMoveHelper getMoveHelper()`
- `PathNavigate getNavigator()`
- `float getRenderSizeModifier()`
- `int getTalkInterval()`
- `int getVerticalFaceSpeed()`
- `boolean hasCustomNameTag()`
- `protected boolean interact(EntityPlayer p_70085_1_)`
- `boolean interactFirst(EntityPlayer p_130002_1_)`
- `protected boolean isAIEnabled()`
- `boolean isNoDespawnRequired()`
- `void onEntityUpdate()`
- `void onLivingUpdate()`
- `IEntityLivingData onSpawnWithEgg(IEntityLivingData p_110161_1_)`
- `void onUpdate()`
- `void playLivingSound()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setAIMoveSpeed(float p_70659_1_)`
- `void setAlwaysRenderNameTag(boolean p_94061_1_)`
- `void setAttackTarget(EntityLivingBase p_70624_1_)`
- `void setCanPickUpLoot(boolean p_98053_1_)`
- `void setCurrentItemOrArmor(int p_70062_1_, ItemStack p_70062_2_)`
- `void setCustomNameTag(java.lang.String p_94058_1_)`
- `void setEquipmentDropChance(int p_96120_1_, float p_96120_2_)`
- `void setLeashedToEntity(Entity p_110162_1_, boolean p_110162_2_)`
- `void setMoveForward(float p_70657_1_)`
- `void spawnExplosionParticle()`
- `protected void updateAITasks()`
- `protected void updateEntityActionState()`
- `protected void updateLeashedState()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `protected float defaultPitch`
- `protected float[] equipmentDropChances`
- `protected int experienceValue`
- `int livingSoundTime`
- `protected int numTicksToChaseTarget`
- `EntityAITasks targetTasks`
- `EntityAITasks tasks`
