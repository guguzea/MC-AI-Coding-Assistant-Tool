---
title: "EntityHanging"
description: "public abstract class EntityHanging extends Entity"
package: "net/minecraft/entity"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/entity/EntityHanging.html"
sourceType: javadoc
---

# EntityHanging

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityHanging

## Class signature

```java
public abstract class EntityHanging extends Entity
```

## Constructors

- `EntityHanging(World p_i1588_1_)`
- `EntityHanging(World p_i1589_1_, int p_i1589_2_, int p_i1589_3_, int p_i1589_4_, int p_i1589_5_)`

## Methods

- `void addVelocity(double p_70024_1_, double p_70024_3_, double p_70024_5_)`
- `boolean attackEntityFrom(DamageSource p_70097_1_, float p_70097_2_)`
- `boolean canBeCollidedWith()`
- `protected void entityInit()`
- `void func_145781_i(int p_145781_1_)`
- `abstract int getHeightPixels()`
- `abstract int getWidthPixels()`
- `boolean hitByEntity(Entity p_85031_1_)`
- `void moveEntity(double p_70091_1_, double p_70091_3_, double p_70091_5_)`
- `abstract void onBroken(Entity p_110128_1_)`
- `void onUpdate()`
- `boolean onValidSurface()`
- `void readEntityFromNBT(NBTTagCompound p_70037_1_)`
- `void setDirection(int p_82328_1_)`
- `protected boolean shouldSetPosAfterLoading()`
- `void writeEntityToNBT(NBTTagCompound p_70014_1_)`

## Fields

- `int field_146062_d`
- `int field_146063_b`
- `int field_146064_c`
- `int hangingDirection`
