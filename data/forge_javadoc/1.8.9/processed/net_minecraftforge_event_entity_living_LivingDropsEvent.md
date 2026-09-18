# LivingDropsEvent

## Class signature

```java
public class LivingDropsEvent extends LivingEvent
```

## Constructors

- `public LivingDropsEvent( EntityLivingBase entity, DamageSource source, java.util.List< EntityItem > drops, int lootingLevel, boolean recentlyHit)`

## Description

LivingDropsEvent is fired when an Entity's death causes dropped items to appear. This event is fired whenever an Entity dies and drops items in EntityLivingBase#onDeath(DamageSource). This event is fi