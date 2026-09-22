---
title: "EntityCreeper"
description: "public class EntityCreeper extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityCreeper.html"
sourceType: javadoc
---

# EntityCreeper

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityCreeper

## Class signature

```java
public class EntityCreeper extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `protected void entityInit()`
- `void fall(float distance, float damageMultiplier)`
- `void func_175493_co()`
- `float getCreeperFlashIntensity(float p_70831_1_)` — Params: (Float)Render tick.
- `int getCreeperState()` — Returns the current state of creeper, -1 is idle, 1 is 'in fuse'
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `int getMaxFallHeight()` — The maximum height from where the entity is alowed to jump (used in pathfinder)
- `boolean getPowered()` — Returns true if the creeper is powered by a lightning bolt.
- `boolean hasIgnited()`
- `void ignite()`
- `protected boolean interact(EntityPlayer player)` — Called when a player interacts with a mob. e.g. gets milk from a cow, gets into the saddle on a pig.
- `boolean isAIEnabled()` — Returns true if the newer Entity AI code should be run
- `void onDeath(DamageSource cause)` — Called when the mob's health reaches 0.
- `void onStruckByLightning(EntityLightningBolt lightningBolt)` — Called when a lightning bolt hits the entity.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setCreeperState(int state)` — Sets the state of creeper, -1 to idle and 1 to be 'in fuse'
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityCreeper`
