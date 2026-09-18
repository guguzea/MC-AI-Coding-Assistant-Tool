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
- `public void onCrystalDestroyed( EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, @Nullable EntityPlayer plyr)`
- `public void initPhase()`
- `public void removeAreaEffect()`
- `public float getMaxRiseOrFall()`
- `@Nullable public Vec3d getTargetLocation()`
- `public float getAdjustedDamage( EntityDragonPart pt, DamageSource src, float damage)`
- `public float getYawFactor()`