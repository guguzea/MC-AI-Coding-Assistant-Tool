# AnvilRepairEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.living.LivingEvent → net.minecraftforge.event.entity.player.PlayerEvent → net.minecraftforge.event.entity.player.AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `AnvilRepairEvent(EntityPlayer player, ItemStack left, ItemStack right, ItemStack output)`

## Methods

- `float getBreakChance()`
- `ItemStack getIngredientInput()` — Get the second item input into the anvil
- `ItemStack getItemInput()` — Get the first item input into the anvil
- `ItemStack getItemResult()` — Get the output result from the anvil
- `@Deprecated ItemStack getLeft()`
- `@Deprecated ItemStack getOutput()`
- `@Deprecated ItemStack getRight()`
- `void setBreakChance(float breakChance)`