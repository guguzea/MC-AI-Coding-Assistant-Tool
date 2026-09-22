---
title: "EntityTameable"
description: "public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable"
package: "net/minecraft/entity/passive"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/passive/EntityTameable.html"
sourceType: javadoc
---

# EntityTameable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityCreature → net.minecraft.entity.EntityAgeable → net.minecraft.entity.passive.EntityAnimal → net.minecraft.entity.passive.EntityTameable

## Class signature

```java
public abstract class EntityTameable extends EntityAnimal implements IEntityOwnable
```

## Constructors

- `EntityTameable(World p_i1604_1_)`

## Methods

- `protected void entityInit()`
- `boolean func_142018_a(EntityLivingBase p_142018_1_, EntityLivingBase p_142018_2_)`
- `java.lang.String func_152113_b()`
- `boolean func_152114_e(EntityLivingBase p_152114_1_)`
- `void func_152115_b(java.lang.String p_152115_1_)`
- `EntityAISit func_70907_r()`
- `EntityLivingBase getOwner()`
- `Team getTeam()`
- `void handleHealthUpdate(byte p_70103_1_)`
- `boolean isOnSameTeam(EntityLivingBase p_142014_1_)`
- `boolean isSitting()`
- `boolean isTamed()`
- `protected void playTameEffect(boolean p_70908_1_)`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setSitting(boolean p_70904_1_)`
- `void setTamed(boolean p_70903_1_)`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `protected EntityAISit aiSit`
