---
title: "EntityWitch"
description: "public class EntityWitch extends EntityMob implements IRangedAttackMob"
package: "net/minecraft/entity/monster"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/monster/EntityWitch.html"
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

- `public static void registerFixesWitch( DataFixer fixer)`
- `protected void initEntityAI()`
- `protected void entityInit()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound( DamageSource damageSourceIn)`
- `protected SoundEvent getDeathSound()`
- `public void setDrinkingPotion(boolean drinkingPotion)`
- `public boolean isDrinkingPotion()`
- `protected void applyEntityAttributes()`
- `public void onLivingUpdate()`
- `public void handleStatusUpdate(byte id)`
- `protected float applyPotionDamageCalculations( DamageSource source, float damage)`
- `protected ResourceLocation getLootTable()`
- `public void attackEntityWithRangedAttack( EntityLivingBase target, float distanceFactor)`
- `public float getEyeHeight()`
- `public void setSwingingArms(boolean swingingArms)`
