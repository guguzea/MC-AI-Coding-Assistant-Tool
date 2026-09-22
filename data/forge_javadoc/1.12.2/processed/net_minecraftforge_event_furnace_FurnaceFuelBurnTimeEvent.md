# FurnaceFuelBurnTimeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.furnace.FurnaceFuelBurnTimeEvent

## Class signature

```java
public class FurnaceFuelBurnTimeEvent extends Event
```

## Constructors

- `FurnaceFuelBurnTimeEvent(ItemStack itemStack, int burnTime)`

## Methods

- `int getBurnTime()` — The resulting value of this event, the burn time for the ItemStack.
- `ItemStack getItemStack()` — Get the ItemStack "fuel" in question.
- `void setBurnTime(int burnTime)` — Set the burn time for the given ItemStack.