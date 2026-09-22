# SleepingTimeCheckEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.SleepingTimeCheckEvent

## Class signature

```java
public class SleepingTimeCheckEvent extends PlayerEvent
```

## Constructors

- `SleepingTimeCheckEvent(EntityPlayer player, BlockPos sleepingLocation)`

## Methods

- `BlockPos getSleepingLocation()` — Note that the sleeping location may be an approximated one.