---
title: "EntityWitherSkull"
description: "public class EntityWitherSkull extends EntityFireball"
package: "net/minecraft/entity/projectile"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/entity/projectile/EntityWitherSkull.html"
sourceType: javadoc
---

# EntityWitherSkull

**Inheritance:** java.lang.Object → net.minecraft.entity.Entity → net.minecraft.entity.projectile.EntityFireball → net.minecraft.entity.projectile.EntityWitherSkull

## Class signature

```java
public class EntityWitherSkull extends EntityFireball
```

## Methods

- `boolean attackEntityFrom(DamageSource source, float amount)` — Called when the entity is attacked.
- `boolean canBeCollidedWith()` — Returns true if other Entities should be prevented from moving through this Entity.
- `protected void entityInit()`
- `float getExplosionResistance(Explosion explosionIn, World worldIn, BlockPos pos, IBlockState blockStateIn)` — Explosion resistance of a block relative to this entity
- `protected float getMotionFactor()` — Return the motion factor for this projectile.
- `boolean isBurning()` — Returns true if the entity is on fire.
- `boolean isInvulnerable()` — Return whether this skull comes from an invulnerable (aura) wither boss.
- `protected void onImpact(MovingObjectPosition movingObject)` — Called when this EntityFireball hits a block or entity.
- `void setInvulnerable(boolean invulnerable)` — Set whether this skull comes from an invulnerable (aura) wither boss.

## Fields

- `EntityWitherSkull`
- `EntityWitherSkull`
- `EntityWitherSkull`
