---
title: "EntityHanging"
description: "public abstract class EntityHanging extends Entity"
package: "net/minecraft/entity"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/EntityHanging.html"
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
- `protected void updateBoundingBox()`
- `public void onUpdate()`
- `public boolean onValidSurface()`
- `public boolean canBeCollidedWith()`
- `public boolean hitByEntity( Entity entityIn)`
- `public EnumFacing getHorizontalFacing()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void move( MoverType type, double x, double y, double z)`
- `public void addVelocity(double x, double y, double z)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public abstract int getWidthPixels()`
- `public abstract int getHeightPixels()`
- `public abstract void onBroken( Entity brokenEntity)`
- `public abstract void playPlaceSound()`
- `public EntityItem entityDropItem( ItemStack stack, float offsetY)`
- `protected boolean shouldSetPosAfterLoading()`
- `public void setPosition(double x, double y, double z)`
- `public BlockPos getHangingPosition()`
- `public float getRotatedYaw( Rotation transformRotation)`
- `public float getMirroredYaw( Mirror transformMirror)`
- `public void onStruckByLightning( EntityLightningBolt lightningBolt)`
