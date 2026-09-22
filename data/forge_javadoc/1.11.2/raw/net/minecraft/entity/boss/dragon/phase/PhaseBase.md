---
title: "PhaseBase"
description: "public abstract class PhaseBase extends java.lang.Object implements IPhase"
package: "net/minecraft/entity/boss/dragon/phase"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/entity/boss/dragon/phase/PhaseBase.html"
sourceType: javadoc
---

# PhaseBase

**Inheritance:** java.lang.Object → net.minecraft.entity.boss.dragon.phase.PhaseBase

## Class signature

```java
public abstract class PhaseBase extends java.lang.Object implements IPhase
```

## Constructors

- `PhaseBase(EntityDragon dragonIn)`

## Methods

- `void doClientRenderEffects()`
- `void doLocalUpdate()`
- `float getAdjustedDamage(EntityDragonPart pt, DamageSource src, float damage)`
- `boolean getIsStationary()`
- `float getMaxRiseOrFall()`
- `Vec3d getTargetLocation()`
- `float getYawFactor()`
- `void initPhase()`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, EntityPlayer plyr)`
- `void removeAreaEffect()`

## Fields

- `protected EntityDragon dragon`
