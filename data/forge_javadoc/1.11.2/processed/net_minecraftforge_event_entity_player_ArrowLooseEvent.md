# ArrowLooseEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.ArrowLooseEvent

## Class signature

```java
public class ArrowLooseEvent extends PlayerEvent
```

## Constructors

- `ArrowLooseEvent(EntityPlayer player, ItemStack bow, World world, int charge, boolean hasAmmo)`

## Methods

- `ItemStack getBow()`
- `int getCharge()`
- `World getWorld()`
- `boolean hasAmmo()`
- `void setCharge(int charge)`