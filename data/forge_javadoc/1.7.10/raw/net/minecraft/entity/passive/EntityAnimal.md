---
title: "EntityAnimal"
description: "public abstract class EntityAnimal extends EntityAgeable implements IAnimals"
package: "net/minecraft/entity/passive"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/passive/EntityAnimal.html"
sourceType: javadoc
---

# EntityAnimal

## Class signature

```java
public abstract class EntityAnimal extends EntityAgeable implements IAnimals
```

## Constructors

- `public EntityAnimal( World p_i1681_1_)`

## Methods

- `protected void updateAITick()`
- `public void onLivingUpdate()`
- `protected void attackEntity( Entity p_70785_1_, float p_70785_2_)`
- `public boolean attackEntityFrom( DamageSource p_70097_1_, float p_70097_2_)`
- `public float getBlockPathWeight(int p_70783_1_, int p_70783_2_, int p_70783_3_)`
- `public void writeEntityToNBT( NBTTagCompound p_70014_1_)`
- `public void readEntityFromNBT( NBTTagCompound p_70037_1_)`
- `protected Entity findPlayerToAttack()`
- `public boolean getCanSpawnHere()`
- `public int getTalkInterval()`
- `protected boolean canDespawn()`
- `protected int getExperiencePoints( EntityPlayer p_70693_1_)`
- `public boolean isBreedingItem( ItemStack p_70877_1_)`
- `public boolean interact( EntityPlayer p_70085_1_)`
- `public void func_146082_f( EntityPlayer p_146082_1_)`
- `public EntityPlayer func_146083_cb()`
- `public boolean isInLove()`
- `public void resetInLove()`
- `public boolean canMateWith( EntityAnimal p_70878_1_)`
- `public void handleHealthUpdate(byte p_70103_1_)`
