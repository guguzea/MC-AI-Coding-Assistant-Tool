# LivingFallEvent

## Class signature

```java
public class LivingFallEvent extends LivingEvent
```

## Constructors

- `public LivingFallEvent( EntityLivingBase entity, float distance, float damageMultiplier)`

## Description

LivingFallEvent is fired when an Entity is set to be falling. This event is fired whenever an Entity is set to fall in EntityLivingBase#fall(float). This event is fired via the ForgeHooks#onLivingFall