---
title: "EntitySquid"
description: "public class EntitySquid extends EntityWaterMob"
package: "net/minecraft/entity/passive"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntitySquid.html"
sourceType: javadoc
---

# EntitySquid

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.passive.EntityWaterMob → net.minecraft.entity.passive.EntitySquid

## Class signature

```java
public class EntitySquid extends EntityWaterMob
```

## Constructors

- `EntitySquid(World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected boolean canTriggerWalking()` — returns if this entity triggers Block.onEntityWalking on the blocks they walk on. used for spiders and wolves to prevent them from trampling crops
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)` — Drop 0-2 items of this living's type
- `boolean func_175567_n()`
- `void func_175568_b(float randomMotionVecXIn, float randomMotionVecYIn, float randomMotionVecZIn)`
- `boolean getCanSpawnHere()` — Checks if the entity's current position is a valid location to spawn this entity.
- `protected java.lang.String getDeathSound()` — Returns the sound this mob makes on death.
- `protected Item getDropItem()`
- `float getEyeHeight()`
- `protected java.lang.String getHurtSound()` — Returns the sound this mob makes when it is hurt.
- `protected java.lang.String getLivingSound()` — Returns the sound this mob makes while it's alive.
- `protected float getSoundVolume()` — Returns the volume for the sounds this mob makes.
- `void handleStatusUpdate(byte id)`
- `boolean isInWater()` — Checks if this entity is inside water (if inWater field is true as a result of handleWaterMovement() returning true)
- `void moveEntityWithHeading(float strafe, float forward)` — Moves the entity based on the specified heading.
- `void onLivingUpdate()` — Called frequently so the entity can update its state every tick as required.

## Fields

- `float lastTentacleAngle` — the last calculated angle of the tentacles in radians
- `float prevSquidPitch`
- `float prevSquidRotation` — previous squidRotation in radians
- `float prevSquidYaw`
- `float squidPitch`
- `float squidRotation` — appears to be rotation in radians; we already have pitch & yaw, so this completes the triumvirate.
- `float squidYaw`
- `float tentacleAngle` — angle of the tentacles in radians
