# PlayerInteractEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent

## Class signature

```java
public class PlayerInteractEvent extends PlayerEvent
```

## Constructors

- `@Deprecated PlayerInteractEvent(EntityPlayer player, PlayerInteractEvent.Action action, BlockPos pos, EnumFacing face, World world)`
- `PlayerInteractEvent(EntityPlayer player, PlayerInteractEvent.Action action, BlockPos pos, EnumFacing face, World world, Vec3 localPos)`

## Methods

- `void setCanceled(boolean cancel)` — Sets the state of this event, not all events are cancelable, and any attempt to cancel a event that can't be will result in a IllegalArgumentException.

## Fields

- `PlayerInteractEvent.Action action`
- `EnumFacing face`
- `Vec3 localPos`
- `BlockPos pos`
- `Event.Result useBlock`
- `Event.Result useItem`
- `World world`