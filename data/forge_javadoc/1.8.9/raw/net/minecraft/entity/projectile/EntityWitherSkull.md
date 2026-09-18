---
title: "EntityWitherSkull"
description: "Called when the entity is attacked."
package: "net/minecraft/entity/projectile"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/projectile/EntityWitherSkull.html"
sourceType: javadoc
---

# EntityWitherSkull

## Class signature

```java
public class EntityWitherSkull extends EntityFireball
```

## Constructors

- `public EntityWitherSkull( World worldIn)`
- `public EntityWitherSkull( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`
- `public EntityWitherSkull( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`

## Methods

- `protected float getMotionFactor()`
- `public boolean isBurning()`
- `public float getExplosionResistance( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)`
- `protected void onImpact( MovingObjectPosition movingObject)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void entityInit()`
- `public boolean isInvulnerable()`
- `public void setInvulnerable(boolean invulnerable)`

## Description

Called when the entity is attacked.
