# CombatTracker

**Inheritance:** java.lang.Object → net.minecraft.util.CombatTracker

## Class signature

```java
public class CombatTracker extends java.lang.Object
```

## Constructors

- `CombatTracker(EntityLivingBase fighterIn)`

## Methods

- `int func_180134_f()`
- `void func_94545_a()`
- `EntityLivingBase func_94550_c()`
- `IChatComponent getDeathMessage()`
- `EntityLivingBase getFighter()` — Returns EntityLivingBase assigned for this CombatTracker
- `void reset()` — Resets this trackers list of combat entries
- `void trackDamage(DamageSource damageSrc, float healthIn, float damageAmount)` — Adds an entry for the combat tracker