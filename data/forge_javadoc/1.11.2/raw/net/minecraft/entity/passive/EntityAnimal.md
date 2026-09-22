---
title: "EntityAnimal"
description: "public abstract class EntityAnimal extends EntityAgeable implements IAnimals"
package: "net/minecraft/entity/passive"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/passive/EntityAnimal.html"
sourceType: javadoc
---

# EntityAnimal

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal

## Class signature

```java
public abstract class EntityAnimal extends EntityAgeable implements IAnimals
```

## Constructors

- `EntityAnimal(World worldIn)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)`
- `protected boolean canDespawn()`
- `boolean canMateWith(EntityAnimal otherAnimal)`
- `protected void consumeItemFromStack(EntityPlayer player, ItemStack stack)`
- `float getBlockPathWeight(BlockPos pos)`
- `boolean getCanSpawnHere()`
- `protected int getExperiencePoints(EntityPlayer player)`
- `EntityPlayer getPlayerInLove()`
- `int getTalkInterval()`
- `double getYOffset()`
- `void handleStatusUpdate(byte id)`
- `boolean isBreedingItem(ItemStack stack)`
- `boolean isInLove()`
- `void onLivingUpdate()`
- `boolean processInteract(EntityPlayer player, EnumHand hand)`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void resetInLove()`
- `void setInLove(EntityPlayer player)`
- `protected void updateAITasks()`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `protected Block spawnableBlock`
