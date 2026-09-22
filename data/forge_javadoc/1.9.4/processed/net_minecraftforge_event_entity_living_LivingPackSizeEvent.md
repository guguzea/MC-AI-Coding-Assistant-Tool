# LivingPackSizeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.living.LivingPackSizeEvent

## Class signature

```java
public class LivingPackSizeEvent extends LivingEvent
```

## Constructors

- `LivingPackSizeEvent(EntityLiving entity)`

## Methods

- `int getMaxPackSize()` — This event is fired when the spawning system determines the maximum amount of the selected entity that can spawn at the same time.
- `void setMaxPackSize(int maxPackSize)`