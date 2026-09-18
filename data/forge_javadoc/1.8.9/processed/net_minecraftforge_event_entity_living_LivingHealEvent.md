# LivingHealEvent

## Class signature

```java
public class LivingHealEvent extends LivingEvent
```

## Constructors

- `public LivingHealEvent( EntityLivingBase entity, float amount)`

## Description

LivingHealEvent is fired when an Entity is set to be healed. This event is fired whenever an Entity is healed in EntityLivingBase#heal(float) This event is fired via the ForgeHooks#onLivingHeal(Entity