# LivingDropsEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingDropsEvent

## Class signature

```java
public class LivingDropsEvent extends LivingEvent
```

## Constructors

- `LivingDropsEvent(EntityLivingBase entity, DamageSource source, java.util.List<EntityItem> drops, int lootingLevel, boolean recentlyHit)`

## Fields

- `java.util.List<EntityItem> drops`
- `int lootingLevel`
- `boolean recentlyHit`
- `DamageSource source`