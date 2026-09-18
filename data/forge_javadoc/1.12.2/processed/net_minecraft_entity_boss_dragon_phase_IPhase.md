# IPhase

## Class signature

```java
public interface IPhase
```

## Methods

- `boolean getIsStationary()`
- `void doClientRenderEffects()`
- `void doLocalUpdate()`
- `void onCrystalDestroyed( EntityEnderCrystal crystal, BlockPos pos, DamageSource dmgSrc, EntityPlayer plyr)`
- `void initPhase()`
- `void removeAreaEffect()`
- `float getMaxRiseOrFall()`
- `float getYawFactor()`
- `PhaseList <? extends IPhase > getType()`
- `Vec3d getTargetLocation()`
- `float getAdjustedDamage( MultiPartEntityPart pt, DamageSource src, float damage)`