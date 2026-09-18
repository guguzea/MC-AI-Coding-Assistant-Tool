---
title: "EntityThrowable"
description: "public abstract class EntityThrowable extends Entity implements IProjectile"
package: "net/minecraftforge/event/entity"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/projectile/EntityThrowable.html"
sourceType: javadoc
---

# EntityThrowable

## Class signature

```java
public abstract class EntityThrowable extends Entity implements IProjectile
```

## Constructors

- `public EntityThrowable( World worldIn)`
- `public EntityThrowable( World worldIn, double x, double y, double z)`
- `public EntityThrowable( World worldIn, EntityLivingBase throwerIn)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void setHeadingFromThrower( Entity entityThrower, float rotationPitchIn, float rotationYawIn, float pitchOffset, float velocity, float inaccuracy)`
- `public void setThrowableHeading(double x, double y, double z, float velocity, float inaccuracy)`
- `public void setVelocity(double x, double y, double z)`
- `public void onUpdate()`
- `protected float getGravityVelocity()`
- `protected abstract void onImpact( RayTraceResult result)`
- `public static void registerFixesThrowable( DataFixer fixer, java.lang.String name)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `@Nullable public EntityLivingBase getThrower()`
