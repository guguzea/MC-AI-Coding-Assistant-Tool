---
title: "IPhase"
description: "public interface IPhase"
package: "net/minecraft/entity/boss/dragon/phase"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/boss/dragon/phase/IPhase.html"
sourceType: javadoc
---

# IPhase

## Class signature

```java
public interface IPhase
```

## Methods

- `void doClientRenderEffects()`
- `void doLocalUpdate()`
- `float getAdjustedDamage(EntityDragonPart pt, DamageSource src, float damage)`
- `boolean getIsStationary()`
- `float getMaxRiseOrFall()`
- `PhaseList<? extends IPhase> getPhaseList()`
- `Vec3d getTargetLocation()`
- `float getYawFactor()`
- `void initPhase()`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, EntityPlayer plyr)`
- `void removeAreaEffect()`
