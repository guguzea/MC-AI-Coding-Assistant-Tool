---
title: "EntityThrowable"
description: "public abstract class EntityThrowable extends Entity implements IProjectile"
package: "net/minecraft/entity/projectile"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/projectile/EntityThrowable.html"
sourceType: javadoc
---

# EntityThrowable

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityThrowable

## Class signature

```java
public abstract class EntityThrowable extends Entity implements IProjectile
```

## Constructors

- `EntityThrowable(World worldIn)`
- `EntityThrowable(World worldIn, double x, double y, double z)`
- `EntityThrowable(World worldIn, EntityLivingBase throwerIn)`

## Methods

- `protected void entityInit()`
- `protected float getGravityVelocity()`
- `EntityLivingBase getThrower()`
- `boolean isInRangeToRenderDist(double distance)`
- `protected abstract void onImpact(RayTraceResult result)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesThrowable(DataFixer fixer, java.lang.String name)`
- `void setHeadingFromThrower(Entity entityThrower, float rotationPitchIn, float rotationYawIn, float pitchOffset, float velocity, float inaccuracy)`
- `void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `void setVelocity(double x, double y, double z)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `Entity ignoreEntity`
- `protected boolean inGround`
- `int throwableShake`
