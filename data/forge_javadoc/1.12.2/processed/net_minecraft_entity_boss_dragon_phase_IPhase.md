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