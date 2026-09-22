# FillBucketEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.FillBucketEvent

## Class signature

```java
public class FillBucketEvent extends PlayerEvent
```

## Constructors

- `FillBucketEvent(EntityPlayer player, ItemStack current, World world, RayTraceResult target)`

## Methods

- `ItemStack getEmptyBucket()`
- `ItemStack getFilledBucket()`
- `RayTraceResult getTarget()`
- `World getWorld()`
- `void setFilledBucket(ItemStack bucket)`