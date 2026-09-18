---
title: "EntityGhast"
description: "public class EntityGhast extends EntityFlying implements IMob"
package: "net/minecraft/entity/monster"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/monster/EntityGhast.html"
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

- `protected void initEntityAI()`
- `public boolean isAttacking()`
- `public void setAttacking(boolean attacking)`
- `public int getFireballStrength()`
- `public void onUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void entityInit()`
- `protected void applyEntityAttributes()`
- `public SoundCategory getSoundCategory()`
- `protected SoundEvent getAmbientSound()`
- `protected SoundEvent getHurtSound()`
- `protected SoundEvent getDeathSound()`
- `@Nullable protected ResourceLocation getLootTable()`
- `protected float getSoundVolume()`
- `public boolean getCanSpawnHere()`
- `public int getMaxSpawnedInChunk()`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public float getEyeHeight()`
