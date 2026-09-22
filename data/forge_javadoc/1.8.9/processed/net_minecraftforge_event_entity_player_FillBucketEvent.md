# FillBucketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.FillBucketEvent

## Class signature

```java
public class FillBucketEvent extends PlayerEvent
```

## Constructors

- `FillBucketEvent(EntityPlayer player, ItemStack current, World world, MovingObjectPosition target)`

## Fields

- `ItemStack current` — This event is fired when a player attempts to use a Empty bucket, it can be canceled to completely prevent any further processing.
- `ItemStack result`
- `MovingObjectPosition target`
- `World world`