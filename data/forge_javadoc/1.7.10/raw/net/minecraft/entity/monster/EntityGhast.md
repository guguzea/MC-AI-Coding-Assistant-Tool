---
title: "EntityGhast"
description: "public class EntityGhast extends EntityFlying implements IMob"
package: "net/minecraft/entity/monster"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/monster/EntityGhast.html"
sourceType: javadoc
---

# EntityGhast

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityLivingBase → net.minecraft.entity.EntityLiving → net.minecraft.entity.EntityFlying → net.minecraft.entity.monster.EntityGhast

## Class signature

```java
public class EntityGhast extends EntityFlying implements IMob
```

## Constructors

- `EntityGhast(World p_i1735_1_)`

## Methods

- `protected void applyEntityAttributes()`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `protected void dropFewItems(boolean p_70628_1_, int p_70628_2_)`
- `protected void entityInit()`
- `boolean func_110182_bF()`
- `boolean getCanSpawnHere()`
- `protected java.lang.String getDeathSound()`
- `protected Item getDropItem()`
- `protected java.lang.String getHurtSound()`
- `protected java.lang.String getLivingSound()`
- `int getMaxSpawnedInChunk()`
- `protected float getSoundVolume()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `protected void updateEntityActionState()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int attackCounter`
- `int courseChangeCooldown`
- `int prevAttackCounter`
- `double waypointX`
- `double waypointY`
- `double waypointZ`
