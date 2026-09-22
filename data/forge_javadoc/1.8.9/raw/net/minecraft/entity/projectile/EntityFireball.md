---
title: "EntityFireball"
description: "public abstract class EntityFireball extends Entity"
package: "net/minecraft/entity/projectile"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/projectile/EntityFireball.html"
sourceType: javadoc
---

# EntityFireball

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFireball

## Class signature

```java
public abstract class EntityFireball extends Entity
```

## Constructors

- `EntityFireball(World worldIn)`
- `EntityFireball(World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `EntityFireball(World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected void entityInit()`
- `float getBrightness(float partialTicks)` — Gets how bright this entity is.
- `int getBrightnessForRender(float partialTicks)`
- `float getCollisionBorderSize()`
- `protected float getMotionFactor()` — Return the motion factor for this projectile.
- `boolean isInRangeToRenderDist(double distance)` — Checks if the entity is in range to render by using the past in distance and comparing it to its average edge length * 64 * renderDistanceWeight Args: distance
- `protected abstract void onImpact(MovingObjectPosition movingObject)` — Called when this EntityFireball hits a block or entity.
- `void onUpdate()` — Called to update the entity's position/logic.
- `void readEntityFromNBT(NBTTagCompound tagCompund)` — (abstract) Protected helper method to read subclass entity data from NBT.
- `void writeEntityToNBT(NBTTagCompound tagCompound)` — (abstract) Protected helper method to write subclass entity data to NBT.

## Fields

- `double accelerationX`
- `double accelerationY`
- `double accelerationZ`
- `EntityLivingBase shootingEntity`
