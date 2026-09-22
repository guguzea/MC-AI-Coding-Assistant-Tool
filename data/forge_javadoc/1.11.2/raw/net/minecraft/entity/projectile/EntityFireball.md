---
title: "EntityFireball"
description: "public abstract class EntityFireball extends Entity"
package: "net/minecraft/entity/projectile"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/projectile/EntityFireball.html"
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

- `boolean attackEntityFrom(DamageSource source, float amount)`
- `boolean canBeCollidedWith()`
- `protected void entityInit()`
- `float getBrightness(float partialTicks)`
- `int getBrightnessForRender(float partialTicks)`
- `float getCollisionBorderSize()`
- `protected float getMotionFactor()`
- `protected EnumParticleTypes getParticleType()`
- `protected boolean isFireballFiery()`
- `boolean isInRangeToRenderDist(double distance)`
- `protected abstract void onImpact(RayTraceResult result)`
- `void onUpdate()`
- `void readEntityFromNBT(NBTTagCompound compound)`
- `static void registerFixesFireball(DataFixer fixer, java.lang.String name)`
- `void writeEntityToNBT(NBTTagCompound compound)`

## Fields

- `double accelerationX`
- `double accelerationY`
- `double accelerationZ`
- `EntityLivingBase shootingEntity`
