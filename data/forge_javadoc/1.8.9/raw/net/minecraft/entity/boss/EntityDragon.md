---
title: "EntityDragon"
description: "Animation time, used to control the speed of the animation cycles (wings flapping, jaw opening, etc.)"
package: "net/minecraft/entity/boss"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/boss/EntityDragon.html"
sourceType: javadoc
---

# EntityDragon

## Class signature

```java
public class EntityDragon extends EntityLiving implements IBossDisplayData , IEntityMultiPart , IMob
```

## Constructors

- `public EntityDragon( World worldIn)`

## Methods

- `protected void applyEntityAttributes()`
- `protected void entityInit()`
- `public double[] getMovementOffsets(int p_70974_1_, float p_70974_2_)`
- `public void onLivingUpdate()`
- `public boolean attackEntityFromPart( EntityDragonPart dragonPart, DamageSource source, float p_70965_3_)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected boolean attackDragonFrom( DamageSource source, float amount)`
- `public void onKillCommand()`
- `protected void onDeathUpdate()`
- `protected void despawnEntity()`
- `public Entity [] getParts()`
- `public boolean canBeCollidedWith()`
- `public World getWorld()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected float getSoundVolume()`

## Description

Animation time, used to control the speed of the animation cycles (wings flapping, jaw opening, etc.)
