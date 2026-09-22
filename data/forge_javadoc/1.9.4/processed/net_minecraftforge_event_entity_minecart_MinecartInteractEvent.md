# MinecartInteractEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.minecart.MinecartEvent → net.minecraftforge.event.entity.minecart.MinecartInteractEvent

## Class signature

```java
public class MinecartInteractEvent extends MinecartEvent
```

## Constructors

- `MinecartInteractEvent(EntityMinecart minecart, EntityPlayer player, ItemStack item, EnumHand hand)`

## Methods

- `EnumHand getHand()`
- `ItemStack getItem()`
- `EntityPlayer getPlayer()`