# ArrowNockEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ArrowNockEvent

## Class signature

```java
public class ArrowNockEvent extends PlayerEvent
```

## Constructors

- `ArrowNockEvent(EntityPlayer player, ItemStack item, EnumHand hand, World world, boolean hasAmmo)`

## Methods

- `ActionResult<ItemStack> getAction()`
- `ItemStack getBow()`
- `EnumHand getHand()`
- `World getWorld()`
- `boolean hasAmmo()`
- `void setAction(ActionResult<ItemStack> action)`