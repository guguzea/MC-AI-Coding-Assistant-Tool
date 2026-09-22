---
title: "EntityHanging"
description: "public abstract class EntityHanging extends Entity"
package: "net/minecraft/entity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/EntityHanging.html"
sourceType: javadoc
---

# EntityHanging

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.EntityHanging

## Class signature

```java
public abstract class EntityHanging extends Entity
```

## Constructors

- `EntityHanging(World worldIn)`
- `EntityHanging(World worldIn, BlockPos hangingPositionIn)`

## Methods

- `void addVelocity(double x, double y, double z)` — Adds to the current velocity of the entity.
- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected void entityInit()`
- `BlockPos getHangingPosition()`
- `abstract int getHeightPixels()`
- `EnumFacing getHorizontalFacing()`
- `abstract int getWidthPixels()`
- `boolean hitByEntity(Entity entityIn)` — Called when a player attacks an entity.
- `void moveEntity(double x, double y, double z)` — Tries to moves the entity by the passed in displacement.
- `abstract void onBroken(Entity brokenEntity)` — Called when this entity is broken.
- `void onUpdate()` — Called to update the entity's position/logic.
- `boolean onValidSurface()` — checks to make sure painting can be placed there
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void setPosition(double x, double y, double z)` — Sets the x,y,z of the entity from the given parameters.
- `protected boolean shouldSetPosAfterLoading()`
- `protected void updateFacingWithBoundingBox(EnumFacing facingDirectionIn)` — Updates facing and bounding box based on it
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `EnumFacing facingDirection` — The direction the entity is facing
- `protected BlockPos hangingPosition`
