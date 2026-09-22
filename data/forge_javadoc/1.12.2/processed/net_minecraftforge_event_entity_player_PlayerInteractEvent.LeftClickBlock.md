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
- `void setCanceled(boolean canceled)` — Sets the cancel state of this event.
- `void setUseBlock(Event.Result triggerBlock)`
- `void setUseItem(Event.Result triggerItem)`