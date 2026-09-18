---
title: "EntityMob"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityMob.html"
sourceType: javadoc
---

# EntityMob

## Class signature

```java
public abstract class EntityMob extends EntityCreature implements IMob
```

## Constructors

- `public EntityMob( World worldIn)`

## Methods

- `public void onLivingUpdate()`
- `public void onUpdate()`
- `protected java.lang.String getSwimSound()`
- `protected java.lang.String getSplashSound()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected java.lang.String getFallSoundString(int damageValue)`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public float getBlockPathWeight( BlockPos pos)`
- `protected boolean isValidLightLevel()`
- `public boolean getCanSpawnHere()`
- `protected void applyEntityAttributes()`
- `protected boolean canDropLoot()`

## Description

Called when the entity is attacked.
