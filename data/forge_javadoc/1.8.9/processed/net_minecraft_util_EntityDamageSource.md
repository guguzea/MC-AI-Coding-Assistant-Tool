# EntityDamageSource

**Inheritance:** java.lang.Object → net.minecraft.util.DamageSource → net.minecraft.util.EntityDamageSource

## Class signature

```java
public class EntityDamageSource extends DamageSource
```

## Constructors

- `EntityDamageSource(java.lang.String p_i1567_1_, Entity damageSourceEntityIn)`

## Methods

- `IChatComponent getDeathMessage(EntityLivingBase p_151519_1_)` — Gets the death message that is displayed when the player dies
- `Entity getEntity()`
- `boolean getIsThornsDamage()`
- `boolean isDifficultyScaled()` — Return whether this damage source will have its damage amount scaled based on the current difficulty.
- `EntityDamageSource setIsThornsDamage()` — Sets this EntityDamageSource as originating from Thorns armor

## Fields

- `protected Entity damageSourceEntity`