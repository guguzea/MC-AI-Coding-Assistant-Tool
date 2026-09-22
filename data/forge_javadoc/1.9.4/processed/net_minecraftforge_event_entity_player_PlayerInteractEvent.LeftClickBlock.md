# PlayerInteractEvent.LeftClickBlock

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent.LeftClickBlock

## Class signature

```java
public static class PlayerInteractEvent.LeftClickBlock extends PlayerInteractEvent
```

## Constructors

- `LeftClickBlock(EntityPlayer player, BlockPos pos, EnumFacing face, Vec3d hitVec)`

## Methods

- `Vec3d getHitVec()`
- `Event.Result getUseBlock()`
- `Event.Result getUseItem()`
- `void setCanceled(boolean canceled)` — Sets the state of this event, not all events are cancelable, and any attempt to cancel a event that can't be will result in a IllegalArgumentException.
- `void setUseBlock(Event.Result triggerBlock)`
- `void setUseItem(Event.Result triggerItem)`