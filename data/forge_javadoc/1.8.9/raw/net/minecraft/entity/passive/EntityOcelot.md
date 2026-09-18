---
title: "EntityOcelot"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/passive"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/passive/EntityOcelot.html"
sourceType: javadoc
---

# EntityOcelot

## Class signature

```java
public class EntityOcelot extends EntityTameable
```

## Constructors

- `public EntityOcelot( World worldIn)`

## Methods

- `protected void entityInit()`
- `public void updateAITasks()`
- `protected boolean canDespawn()`
- `protected void applyEntityAttributes()`
- `public void fall(float distance, float damageMultiplier)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `protected java.lang.String getLivingSound()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getDeathSound()`
- `protected float getSoundVolume()`
- `protected Item getDropItem()`
- `public boolean attackEntityAsMob( Entity entityIn)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `public boolean interact( EntityPlayer player)`
- `public EntityOcelot createChild( EntityAgeable ageable)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public int getTameSkin()`
- `public void setTameSkin(int skinId)`
- `public boolean getCanSpawnHere()`
- `public boolean isNotColliding()`
- `public java.lang.String getName()`
- `public void setTamed(boolean tamed)`
- `protected void setupTamedAI()`
- `public IEntityLivingData onInitialSpawn( DifficultyInstance difficulty, IEntityLivingData livingdata)`

## Description

Called when the entity is attacked.
