---
title: "PhaseBase"
description: "public abstract class PhaseBase extends java.lang.Object implements IPhase"
package: "net/minecraft/entity/boss/dragon/phase"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/boss/dragon/phase/PhaseBase.html"
sourceType: javadoc
---

# PhaseBase

## Class signature

```java
public abstract class PhaseBase extends java.lang.Object implements IPhase
```

## Constructors

- `public PhaseBase( EntityDragon dragonIn)`

## Methods

- `public boolean getIsStationary()`
- `public void doClientRenderEffects()`
- `public void doLocalUpdate()`
- `public void onCrystalDestroyed( EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, EntityPlayer plyr)`
- `public void initPhase()`
- `public void removeAreaEffect()`
- `public float getMaxRiseOrFall()`
- `public Vec3d getTargetLocation()`
- `public float getAdjustedDamage( MultiPartEntityPart pt, DamageSource src, float damage)`
- `public float getYawFactor()`
