---
title: "EntityIronGolem"
description: "public class EntityIronGolem extends EntityGolem"
package: "net/minecraft/entity/monster"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityIronGolem.html"
sourceType: javadoc
---

# EntityIronGolem

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityGolem → net.minecraft.entity.monster.EntityIronGolem

## Class signature

```java
public class EntityIronGolem extends EntityGolem
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean canAttackClass(java.lang.Class<? extends EntityLivingBase> cls)` — Returns true if this entity can attack entities of the specified class.
- `protected void collideWithEntity(Entity p_82167_1_)`
- `protected int decreaseAirSupply(int p_70682_1_)` — Decrements the entity's air supply when underwater
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `int getAttackTimer()`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `int getHoldRoseTick()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `Village getVillage()`
- `void handleStatusUpdate(byte id)`
- `boolean isPlayerCreated()`
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `protected void playStepSound(BlockPos pos, Block blockIn)`
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setHoldingRose(boolean p_70851_1_)`
- `void setPlayerCreated(boolean p_70849_1_)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityIronGolem`
