---
title: "EntityHanging"
description: "public abstract class EntityHanging extends Entity"
package: "net/minecraft/entity"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/EntityHanging.html"
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

- `void addVelocity(double x, double y, double z)`
- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeCollidedWith()`
- `EntityItem entityDropItem(ItemStack stack, float offsetY)`
- `protected void entityInit()`
- `BlockPos getHangingPosition()`
- `abstract int getHeightPixels()`
- `EnumFacing getHorizontalFacing()`
- `float getMirroredYaw(Mirror transformMirror)`
- `float getRotatedYaw(Rotation transformRotation)`
- `abstract int getWidthPixels()`
- `boolean hitByEntity(Entity entityIn)`
- `void move(MoverType type, double x, double y, double z)`
- `abstract void onBroken(Entity brokenEntity)`
- `void onStruckByLightning(EntityLightningBolt lightningBolt)`
- `void onUpdate()`
- `boolean onValidSurface()`
- `abstract void playPlaceSound()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `void setPosition(double x, double y, double z)`
- `protected boolean shouldSetPosAfterLoading()`
- `protected void updateBoundingBox()`
- `protected void updateFacingWithBoundingBox(EnumFacing facingDirectionIn)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `EnumFacing facingDirection`
- `protected BlockPos hangingPosition`
