# PlayerInteractEvent.EntityInteractSpecific

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent → net.minecraftforge.event.entity.player.PlayerInteractEvent.EntityInteractSpecific

## Class signature

```java
public static class PlayerInteractEvent.EntityInteractSpecific extends PlayerInteractEvent
```

## Constructors

- `EntityInteractSpecific(EntityPlayer player, EnumHand hand, Entity target, Vec3d localPos)`

## Methods

- `Vec3d getLocalPos()` — Returns the local interaction position.
- `Entity getTarget()`