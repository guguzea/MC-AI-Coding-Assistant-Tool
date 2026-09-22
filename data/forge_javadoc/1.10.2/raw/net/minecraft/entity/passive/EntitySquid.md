---
title: "EntitySquid"
description: "public class EntitySquid extends EntityWaterMob"
package: "net/minecraft/entity/passive"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/passive/EntitySquid.html"
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
- `protected boolean canTriggerWalking()`
- `protected SoundEvent getAmbientSound()`
- `boolean getCanSpawnHere()`
- `protected SoundEvent getDeathSound()`
- `float getEyeHeight()`
- `protected SoundEvent getHurtSound()`
- `protected ResourceLocation getLootTable()`
- `protected float getSoundVolume()`
- `void handleStatusUpdate(byte id)`
- `boolean hasMovementVector()`
- `protected void initEntityAI()`
- `boolean isInWater()`
- `void moveEntityWithHeading(float strafe, float forward)`
- `void onLivingUpdate()`
- `static void registerFixesSquid(DataFixer fixer)`
- `void setMovementVector(float randomMotionVecXIn, float randomMotionVecYIn, float randomMotionVecZIn)`

## Fields

- `float lastTentacleAngle`
- `float prevSquidPitch`
- `float prevSquidRotation`
- `float prevSquidYaw`
- `float squidPitch`
- `float squidRotation`
- `float squidYaw`
- `float tentacleAngle`
