# LivingFallEvent

## Class signature

```java
public class LivingFallEvent extends LivingEvent
```

## Constructors

- `public LivingFallEvent( EntityLivingBase entity, float distance, float damageMultiplier)`

## Methods

- `public float getDistance()`
- `public void setDistance(float distance)`
- `public float getDamageMultiplier()`
- `public void setDamageMultiplier(float damageMultiplier)`

## Description

LivingFallEvent is fired when an Entity is set to be falling. This event is fired whenever an Entity is set to fall in EntityLivingBase#fall(float). This event is fired via the ForgeHooks#onLivingFall