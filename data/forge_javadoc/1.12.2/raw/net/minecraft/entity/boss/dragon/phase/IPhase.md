---
title: "IPhase"
description: "public interface IPhase"
package: "net/minecraft/entity/boss/dragon/phase"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/entity/boss/dragon/phase/IPhase.html"
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
- `float getAdjustedDamage(MultiPartEntityPart pt, DamageSource src, float damage)`
- `boolean getIsStationary()`
- `float getMaxRiseOrFall()`
- `Vec3d getTargetLocation()`
- `PhaseList<? extends IPhase> getType()`
- `float getYawFactor()`
- `void initPhase()`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, EntityPlayer plyr)`
- `void removeAreaEffect()`
