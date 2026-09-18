---
title: "EntityGhast"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityGhast.html"
sourceType: javadoc
---

# EntityGhast

## Class signature

```java
public class EntityGhast extends EntityFlying implements IMob
```

## Constructors

- `public EntityGhast( World worldIn)`

## Methods

- `public boolean isAttacking()`
- `public void setAttacking(boolean p_175454_1_)`
- `public int getFireballStrength()`
- `public void onUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected float getSoundVolume()`
- `public boolean getCanSpawnHere()`
- `public int getMaxSpawnedInChunk()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public float getEyeHeight()`

## Description

Called when the entity is attacked.
