---
title: "EntityEnderman"
description: "public class EntityEnderman extends EntityMob"
package: "net/minecraft/entity/monster"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityEnderman.html"
sourceType: javadoc
---

# EntityEnderman

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob → net.minecraft.entity.monster.EntityEnderman

## Class signature

```java
public class EntityEnderman extends EntityMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `protected void entityInit()`
- `static boolean getCarriable(Block block)`
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `IBlockState getHeldBlockState()` — Gets this enderman's held block state
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `boolean isScreaming()`
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `static void setCarriable(Block block, boolean canCarry)`
- `void setHeldBlockState(IBlockState state)` — Sets this enderman's held block state
- `void setScreaming(boolean screaming)`
- `protected boolean teleportRandomly()` — Teleport the enderman to a random nearby position
- `protected boolean teleportTo(double x, double y, double z)` — Teleport the enderman
- `protected boolean teleportToEntity(Entity p_70816_1_)` — Teleport the enderman to another entity
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EntityEnderman`
