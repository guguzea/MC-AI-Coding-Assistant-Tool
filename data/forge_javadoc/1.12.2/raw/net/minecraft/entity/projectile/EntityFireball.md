---
title: "EntityFireball"
description: "public abstract class EntityFireball extends Entity"
package: "net/minecraft/entity/projectile"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/projectile/EntityFireball.html"
sourceType: javadoc
---

# EntityFireball

## Class signature

```java
public abstract class EntityFireball extends Entity
```

## Constructors

- `public EntityFireball( World worldIn)`
- `public EntityFireball( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `public EntityFireball( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `protected void entityInit()`
- `public boolean isInRangeToRenderDist(double distance)`
- `public void onUpdate()`
- `protected boolean isFireballFiery()`
- `protected EnumParticleTypes getParticleType()`
- `protected float getMotionFactor()`
- `protected abstract void onImpact( RayTraceResult result)`
- `public static void registerFixesFireball( DataFixer fixer, java.lang.String name)`
- `public void writeEntityToNBT( NBTTagCompound compound)`
- `public void readEntityFromNBT( NBTTagCompound compound)`
- `public boolean canBeCollidedWith()`
- `public float getCollisionBorderSize()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public float getBrightness()`
- `public int getBrightnessForRender()`
