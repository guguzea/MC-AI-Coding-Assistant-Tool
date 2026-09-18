---
title: "EntityBoat"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/item"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/item/EntityBoat.html"
sourceType: javadoc
---

# EntityBoat

## Class signature

```java
public class EntityBoat extends Entity
```

## Constructors

- `public EntityBoat( World worldIn)`
- `public EntityBoat( World worldIn, double p_i1705_2_, double p_i1705_4_, double p_i1705_6_)`

## Methods

- `protected boolean canTriggerWalking()`
- `protected void entityInit()`
- `public AxisAlignedBB getCollisionBox( Entity entityIn)`
- `public AxisAlignedBB getCollisionBoundingBox()`
- `public boolean canBePushed()`
- `public double getMountedYOffset()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void performHurtAnimation()`
- `public boolean canBeCollidedWith()`
- `public void setPositionAndRotation2(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean p_180426_10_)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `public void updateRiderPosition()`
- `protected void writeEntityToNBT( NBTTagCompound tagCompound)`
- `protected void readEntityFromNBT( NBTTagCompound tagCompund)`
- `public boolean interactFirst( EntityPlayer playerIn)`
- `protected void updateFallState(double y, boolean onGroundIn, Block blockIn, BlockPos pos)`
- `public void setDamageTaken(float p_70266_1_)`
- `public float getDamageTaken()`
- `public void setTimeSinceHit(int p_70265_1_)`
- `public int getTimeSinceHit()`
- `public void setForwardDirection(int p_70269_1_)`
- `public int getForwardDirection()`
- `public void setIsBoatEmpty(boolean p_70270_1_)`

## Description

Called when the entity is attacked.
