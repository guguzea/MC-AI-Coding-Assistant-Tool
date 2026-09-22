# PlayerDestroyItemEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.PlayerDestroyItemEvent

## Class signature

```java
public class PlayerDestroyItemEvent extends PlayerEvent
```

## Constructors

- `PlayerDestroyItemEvent(EntityPlayer player, ItemStack original, EnumHand hand)`

## Methods

- `EnumHand getHand()`
- `ItemStack getOriginal()`