---
title: "EntityPigZombie"
description: "Causes this Entity to drop a random item."
package: "net/minecraft/entity/monster"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/monster/EntityPigZombie.html"
sourceType: javadoc
---

# EntityPigZombie

## Class signature

```java
public class EntityPigZombie extends EntityZombie
```

## Constructors

- `public EntityPigZombie( World worldIn)`

## Methods

- `public void setRevengeTarget( EntityLivingBase livingBase)`
- `protected void applyEntityAI()`
- `protected void applyEntityAttributes()`
- `public void onUpdate()`
- `protected void updateAITasks()`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public boolean isAngry()`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public boolean interact( EntityPlayer player)`
- `protected void addRandomDrop()`
- `protected void setEquipmentBasedOnDifficulty( DifficultyInstance difficulty)`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`

## Description

Causes this Entity to drop a random item.
