---
title: "EntityHanging"
description: "The direction the entity is facing"
package: "net/minecraft/entity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityHanging.html"
sourceType: javadoc
---

# EntityHanging

## Class signature

```java
public abstract class EntityHanging extends Entity
```

## Constructors

- `public EntityHanging( World worldIn)`
- `public EntityHanging( World worldIn, BlockPos hangingPositionIn)`

## Methods

- `protected void entityInit()`
- `protected void updateFacingWithBoundingBox( EnumFacing facingDirectionIn)`
- `public void onUpdate()`
- `public boolean onValidSurface()`
- `public boolean canBeCollidedWith()`
- `public boolean hitByEntity( Entity entityIn)`
- `public EnumFacing getHorizontalFacing()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void moveEntity(double x, double y, double z)`
- `public void addVelocity(double x, double y, double z)`
- `public void writeEntityToNBT( NBTTagCompound tagCompound)`
- `public void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public abstract int getWidthPixels()`
- `public abstract int getHeightPixels()`
- `public abstract void onBroken( Entity brokenEntity)`
- `protected boolean shouldSetPosAfterLoading()`
- `public void setPosition(double x, double y, double z)`
- `public BlockPos getHangingPosition()`

## Description

The direction the entity is facing
