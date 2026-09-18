---
title: "EntityWitch"
description: "Reduces damage, depending on potions"
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityWitch.html"
sourceType: javadoc
---

# EntityWitch

## Class signature

```java
public class EntityWitch extends EntityMob implements IRangedAttackMob
```

## Constructors

- `public EntityWitch( World worldIn)`

## Methods

- `protected void entityInit()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `public void setAggressive(boolean aggressive)`
- `public boolean getAggressive()`
- `protected void applyEntityAttributes()`
- `public void onLivingUpdate()`
- `public void handleStatusUpdate(byte id)`
- `protected float applyPotionDamageCalculations( DamageSource source, float damage)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public void attackEntityWithRangedAttack( EntityLivingBase p_82196_1_, float p_82196_2_)`
- `public float getEyeHeight()`

## Description

Reduces damage, depending on potions
