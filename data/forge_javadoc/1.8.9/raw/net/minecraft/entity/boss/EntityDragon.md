---
title: "EntityDragon"
description: "public class EntityDragon extends EntityLiving implements IBossDisplayData, IEntityMultiPart, IMob"
package: "net/minecraft/entity/boss"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/boss/EntityDragon.html"
sourceType: javadoc
---

# EntityDragon

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.boss.EntityDragon

## Class signature

```java
public class EntityDragon extends EntityLiving implements IBossDisplayData, IEntityMultiPart, IMob
```

## Constructors

- `EntityDragon(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected boolean attackDragonFrom(DamageSource source, float amount)` — Provides a way to cause damage to an ender dragon.
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean attackEntityFromPart(EntityDragonPart dragonPart, DamageSource source, float p_70965_3_)`
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected void despawnEntity()` — Makes the entity despawn if requirements are reached
- `protected void entityInit()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `double[] getMovementOffsets(int p_70974_1_, float p_70974_2_)` — Returns a double[3] array with movement offsets, used to calculate trailing tail/neck positions. [0] = yaw offset, [1] = y offset, [2] = unused, always 0.
- `Entity [] getParts()` — Return the Entity parts making up this Entity (currently only for dragons)
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `World getWorld()`
- `protected void onDeathUpdate()` — handles entity death timer, experience orb and particle creation
- `void onKillCommand()` — Called by the /kill command.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.

## Fields

- `float animTime` — Animation time, used to control the speed of the animation cycles (wings flapping, jaw opening, etc.)
- `int deathTicks`
- `EntityDragonPart [] dragonPartArray` — An array containing all body parts of this dragon
- `EntityDragonPart dragonPartBody` — The body bounding box of a dragon
- `EntityDragonPart dragonPartHead` — The head bounding box of a dragon
- `EntityDragonPart dragonPartTail1`
- `EntityDragonPart dragonPartTail2`
- `EntityDragonPart dragonPartTail3`
- `EntityDragonPart dragonPartWing1`
- `EntityDragonPart dragonPartWing2`
- `boolean forceNewTarget` — Force selecting a new flight target at next tick if set to true.
- `EntityEnderCrystal healingEnderCrystal` — The current endercrystal that is healing this dragon
- `float prevAnimTime` — Animation time at previous tick.
- `double[][] ringBuffer` — Ring buffer array for the last 64 Y-positions and yaw rotations.
- `int ringBufferIndex` — Index into the ring buffer.
- `boolean slowed` — Activated if the dragon is flying though obsidian, white stone or bedrock.
- `double targetX`
- `double targetY`
- `double targetZ`
