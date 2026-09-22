---
title: "EntityDragon"
description: "public class EntityDragon extends EntityLiving implements IBossDisplayData, IEntityMultiPart, IMob"
package: "net/minecraft/entity/boss"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/boss/EntityDragon.html"
sourceType: javadoc
---

# EntityDragon

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.boss.EntityDragon

## Class signature

```java
public class EntityDragon extends EntityLiving implements IBossDisplayData, IEntityMultiPart, IMob
```

## Constructors

- `EntityDragon(World p_i1700_1_)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean attackEntityFromPart(EntityDragonPart p_70965_1_, DamageSource p_70965_2_, float p_70965_3_)`
- `boolean canBeCollidedWith()`
- `protected void despawnEntity()`
- `protected void entityInit()`
- `World func_82194_d()`
- `protected boolean func_82195_e(DamageSource p_82195_1_, float p_82195_2_)`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getLivingSound()`
- `double[] getMovementOffsets(int p_70974_1_, float p_70974_2_)`
- `Entity [] getParts()`
- `protected float getSoundVolume()`
- `protected void onDeathUpdate()`
- `void onLivingUpdate()`

## Fields

- `float animTime`
- `int deathTicks`
- `EntityDragonPart [] dragonPartArray`
- `EntityDragonPart dragonPartBody`
- `EntityDragonPart dragonPartHead`
- `EntityDragonPart dragonPartTail1`
- `EntityDragonPart dragonPartTail2`
- `EntityDragonPart dragonPartTail3`
- `EntityDragonPart dragonPartWing1`
- `EntityDragonPart dragonPartWing2`
- `boolean forceNewTarget`
- `EntityEnderCrystal healingEnderCrystal`
- `float prevAnimTime`
- `double[][] ringBuffer`
- `int ringBufferIndex`
- `boolean slowed`
- `double targetX`
- `double targetY`
- `double targetZ`
