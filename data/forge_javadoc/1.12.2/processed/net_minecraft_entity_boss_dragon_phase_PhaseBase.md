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
- `float getAdjustedDamage(MultiPartEntityPart pt, DamageSource src, float damage)`
- `boolean getIsStationary()`
- `float getMaxRiseOrFall()`
- `Vec3d getTargetLocation()`
- `float getYawFactor()`
- `void initPhase()`
- `void onCrystalDestroyed(EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, EntityPlayer plyr)`
- `void removeAreaEffect()`

## Fields

- `protected EntityDragon dragon`