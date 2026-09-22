# PhaseList

**Inheritance:** java.lang.Object → net.minecraft.entity.boss.dragon.phase.PhaseList<T>

## Class signature

```java
public class PhaseList<T extends IPhase> extends java.lang.Object
```

## Methods

- `IPhase createPhase(EntityDragon dragon)`
- `static PhaseList<?> getById(int idIn)`
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