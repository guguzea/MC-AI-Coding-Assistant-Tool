---
title: "PhaseList"
description: "public class PhaseList<T extends IPhase> extends java.lang.Object"
package: "net/minecraft/entity/boss/dragon/phase"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/entity/boss/dragon/phase/PhaseList.html"
sourceType: javadoc
---

# PhaseList

**Inheritance:** java.lang.Object → net.minecraft.entity.boss.dragon.phase.PhaseList<T>

## Class signature

```java
public class PhaseList<T extends IPhase> extends java.lang.Object
```

## Methods

- `IPhase createPhase(EntityDragon dragon)`
- `static PhaseList<?> getById(int p_188738_0_)`
- `protected java.lang.reflect.Constructor<? extends IPhase> getConstructor()`
- `int getId()`
- `static int getTotalPhases()`
- `java.lang.String toString()`

## Fields

- `static PhaseList<PhaseChargingPlayer> CHARGING_PLAYER`
- `static PhaseList<PhaseDying> DYING`
- `static PhaseList<PhaseHoldingPattern> HOLDING_PATTERN`
- `static PhaseList<PhaseHover> HOVER`
- `static PhaseList<PhaseLanding> LANDING`
- `static PhaseList<PhaseLandingApproach> LANDING_APPROACH`
- `static PhaseList<PhaseSittingAttacking> SITTING_ATTACKING`
- `static PhaseList<PhaseSittingFlaming> SITTING_FLAMING`
- `static PhaseList<PhaseSittingScanning> SITTING_SCANNING`
- `static PhaseList<PhaseStrafePlayer> STRAFE_PLAYER`
- `static PhaseList<PhaseTakeoff> TAKEOFF`
