---
title: "IPhase"
description: "public interface IPhase"
package: "net/minecraft/entity/boss/dragon/phase"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/entity/boss/dragon/phase/IPhase.html"
sourceType: javadoc
---

# IPhase

## Class signature

```java
public interface IPhase
```

## Methods

- `boolean getIsStationary()`
- `void doClientRenderEffects()`
- `void doLocalUpdate()`
- `void onCrystalDestroyed( EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, @Nullable EntityPlayer plyr)`
- `void initPhase()`
- `void removeAreaEffect()`
- `float getMaxRiseOrFall()`
- `float getYawFactor()`
- `PhaseList <? extends IPhase > getPhaseList()`
- `@Nullable Vec3d getTargetLocation()`
- `float getAdjustedDamage( EntityDragonPart pt, DamageSource src, float damage)`
