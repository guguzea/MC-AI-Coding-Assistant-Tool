---
title: "EntityDragonFireball"
description: "public class EntityDragonFireball extends EntityFireball"
package: "net/minecraft/entity/projectile"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/projectile/EntityDragonFireball.html"
sourceType: javadoc
---

# EntityDragonFireball

## Class signature

```java
public class EntityDragonFireball extends EntityFireball
```

## Constructors

- `public EntityDragonFireball( World worldIn)`
- `public EntityDragonFireball( World worldIn, double x, double y, double z, double accelX, double accelY, double accelZ)`
- `public EntityDragonFireball( World worldIn, EntityLivingBase shooter, double accelX, double accelY, double accelZ)`

## Methods

- `public static void registerFixesDragonFireball( DataFixer fixer)`
- `protected void onImpact( RayTraceResult result)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected EnumParticleTypes getParticleType()`
- `protected boolean isFireballFiery()`
