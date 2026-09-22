# AnvilRepairEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `AnvilRepairEvent(EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`

## Fields

- `float breakChance`
- `ItemStack left` — Fired when the player removes a "repaired" item from the Anvil's Output slot.
- `ItemStack output`
- `ItemStack right`