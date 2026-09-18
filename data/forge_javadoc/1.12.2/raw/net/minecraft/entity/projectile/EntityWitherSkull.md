---
title: "EntityWitherSkull"
description: "public class EntityWitherSkull extends EntityFireball"
package: "net/minecraft/entity/projectile"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/projectile/EntityWitherSkull.html"
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

- `public static void registerFixesWitherSkull( DataFixer fixer)`
- `protected float getMotionFactor()`
- `public boolean isBurning()`
- `public float getExplosionResistance( Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)`
- `protected void onImpact( RayTraceResult result)`
- `public boolean canBeCollidedWith()`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `protected void entityInit()`
- `public boolean isInvulnerable()`
- `public void setInvulnerable(boolean invulnerable)`
- `protected boolean isFireballFiery()`
