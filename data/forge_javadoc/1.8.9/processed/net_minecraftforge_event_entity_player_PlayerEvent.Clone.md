# PlayerEvent.Clone

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerEvent.Clone

## Class signature

```java
public static class PlayerEvent.Clone extends PlayerEvent
```

## Constructors

- `Clone(EntityPlayer _new, EntityPlayer oldPlayer, boolean wasDeath)`

## Fields

- `EntityPlayer original` — The old EntityPlayer that this new entity is a clone of.
- `boolean wasDeath` — True if this event was fired because the player died.