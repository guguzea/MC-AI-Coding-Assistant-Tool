---
title: "EntityWither"
description: "public class EntityWither extends EntityMob implements IBossDisplayData, IRangedAttackMob"
package: "net/minecraft/entity/boss"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/boss/EntityWither.html"
sourceType: javadoc
---

# EntityWither

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.boss.EntityWither

## Class signature

```java
public class EntityWither extends EntityMob implements IBossDisplayData, IRangedAttackMob
```

## Methods

- `void addPotionEffect(PotionEffect potioneffectIn)` — adds a PotionEffect to the entity
- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `void attackEntityWithRangedAttack(EntityLivingBase p_82196_1_, float p_82196_2_)` — Attack the specified entity using a ranged attack.
- `protected void despawnEntity()` — Makes the entity despawn if requirements are reached
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `static boolean func_181033_a(Block p_181033_0_)`
- `void func_82206_m()`
- `float func_82207_a(int p_82207_1_)`
- `float func_82210_r(int p_82210_1_)`
- `int getBrightnessForRender(float partialTicks)`
- `EnumCreatureAttribute getCreatureAttribute()` — Get this Entity's EnumCreatureAttribute
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `int getInvulTime()`
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `int getTotalArmorValue()` — Returns the current armor value as determined by a call to InventoryPlayer.getTotalArmorValue
- `int getWatchedTargetId(int p_82203_1_)` — Returns the target entity ID if present, or -1 if not @param par1 The target offset, should be from 0-2
- `boolean isArmored()` — Returns whether the wither is armored with its boss armor or not by checking whether its health is below half of its maximum.
- `void mountEntity(Entity entityIn)` — Called when a player mounts an entity. e.g. mounts a pig, mounts a boat.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setInvulTime(int p_82215_1_)`
- `void setInWeb()` — Sets the Entity inside a web block.
- `protected void updateAITasks()`
- `void updateWatchedTargetId(int targetOffset, int newId)` — Updates the target entity ID
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityWither`
