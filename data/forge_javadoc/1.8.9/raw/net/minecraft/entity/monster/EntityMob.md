---
title: "EntityMob"
description: "public abstract class EntityMob extends EntityCreature implements IMob"
package: "net/minecraft/entity/monster"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityMob.html"
sourceType: javadoc
---

# EntityMob

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.monster.EntityMob

## Class signature

```java
public abstract class EntityMob extends EntityCreature implements IMob
```

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityAsMob(Entity entityIn)`
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `protected boolean canDropLoot()` — Entity won't drop items or experience points if this returns false
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected java.lang.String getFallSoundString(int damageValue)`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getSplashSound()`
- `protected java.lang.String getSwimSound()`
- `protected boolean isValidLightLevel()` — Checks to make sure the light is not too bright where the mob is spawning
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.
- `void onUpdate()` — Called to update the entity's position/logic.

## Fields

- `EntityMob`
