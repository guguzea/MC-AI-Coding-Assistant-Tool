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