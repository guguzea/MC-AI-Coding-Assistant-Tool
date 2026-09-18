---
title: "EntityWitch"
description: "public class EntityWitch extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/monster/EntityWitch.html"
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

- `protected void initEntityAI()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `public void setAggressive(boolean aggressive)`
- `public boolean isDrinkingPotion()`
- `protected void applyEntityAttributes()`
- `public void onLivingUpdate()`
- `public void handleStatusUpdate(byte id)`
- `protected float applyPotionDamageCalculations( DamageSource source, float damage)`
- `@Nullable protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float p_82196_2_)`
- `public float getEyeHeight()`
