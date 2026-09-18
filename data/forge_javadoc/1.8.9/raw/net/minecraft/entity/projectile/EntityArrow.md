---
title: "EntityArrow"
description: "Seems to be some sort of timer for animating an arrow."
package: "net/minecraft/entity/projectile"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/projectile/EntityArrow.html"
sourceType: javadoc
---

# EntityArrow

## Class signature

```java
public class EntityArrow extends Entity implements IProjectile
```

## Constructors

- `public EntityArrow( World worldIn)`
- `public EntityArrow( World worldIn, double x, double y, double z)`
- `public EntityArrow( World worldIn, EntityLivingBase shooter, EntityLivingBase p_i1755_3_, float p_i1755_4_, float p_i1755_5_)`
- `public EntityArrow( World worldIn, EntityLivingBase shooter, float velocity)`

## Methods

- `protected void entityInit()`
- `public void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public void onCollideWithPlayer( EntityPlayer entityIn)`
- `protected boolean canTriggerWalking()`
- `public void setDamage(double damageIn)`
- `public double getDamage()`
- `public void setKnockbackStrength(int knockbackStrengthIn)`
- `public boolean canAttackWithItem()`
- `public float getEyeHeight()`
- `public void setIsCritical(boolean critical)`
- `public boolean getIsCritical()`

## Description

Seems to be some sort of timer for animating an arrow.
