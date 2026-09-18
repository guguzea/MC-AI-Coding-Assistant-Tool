---
title: "EntityAnimal"
description: "public abstract class EntityAnimal extends EntityAgeable implements IAnimals"
package: "net/minecraft/entity/passive"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/passive/EntityAnimal.html"
sourceType: javadoc
---

# EntityAnimal

## Class signature

```java
public abstract class EntityAnimal extends EntityAgeable implements IAnimals
```

## Constructors

- `public EntityAnimal( World worldIn)`

## Methods

- `protected void updateAITasks()`
- `public void onLivingUpdate()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public float getBlockPathWeight( BlockPos pos)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public double getYOffset()`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean getCanSpawnHere()`
- `public int getTalkInterval()`
- `protected boolean canDespawn()`
- `protected int getExperiencePoints( EntityPlayer player)`
- `public boolean isBreedingItem( ItemStack stack)`
- `public boolean processInteract( EntityPlayer player, EnumHand hand)`
- `protected void consumeItemFromStack( EntityPlayer player, ItemStack stack)`
- `public void setInLove( EntityPlayer player)`
- `public EntityPlayer getPlayerInLove()`
- `public boolean isInLove()`
- `public void resetInLove()`
- `public boolean canMateWith( EntityAnimal otherAnimal)`
- `public void handleStatusUpdate(byte id)`
