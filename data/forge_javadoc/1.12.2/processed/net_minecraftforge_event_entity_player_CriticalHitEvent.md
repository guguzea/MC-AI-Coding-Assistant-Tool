# CriticalHitEvent

## Class signature

```java
public class CriticalHitEvent extends PlayerEvent
```

## Constructors

- `public CriticalHitEvent( EntityPlayer player, Entity target, float damageModifier, boolean vanillaCritical)`

## Methods

- `public Entity getTarget()`
- `public void setDamageModifier(float mod)`
- `public float getDamageModifier()`
- `public float getOldDamageModifier()`
- `public boolean isVanillaCritical()`

## Description

This event is fired whenever a player attacks an Entity in EntityPlayer#attackTargetEntityWithCurrentItem(Entity). This event is not Cancelable . This event has a result. Event.HasResult DEFAULT: mean