# CriticalHitEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.CriticalHitEvent

## Class signature

```java
public class CriticalHitEvent extends PlayerEvent
```

## Constructors

- `CriticalHitEvent(EntityPlayer player, Entity target, float damageModifier, boolean vanillaCritical)`

## Methods

- `float getDamageModifier()` — The damage modifier for the hit.
- `float getOldDamageModifier()` — The orignal damage modifier for the hit wthout any changes.
- `Entity getTarget()` — The Entity that was damaged by the player.
- `boolean isVanillaCritical()` — Returns true if this hit was critical by vanilla
- `void setDamageModifier(float mod)` — This set the damage multiplier for the hit.