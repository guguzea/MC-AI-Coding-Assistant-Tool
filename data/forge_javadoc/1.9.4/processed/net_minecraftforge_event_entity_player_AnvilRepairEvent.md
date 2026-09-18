# AnvilRepairEvent

## Class signature

```java
public class AnvilRepairEvent extends PlayerEvent
```

## Constructors

- `public AnvilRepairEvent( EntityPlayer player, ItemStack output, ItemStack left, ItemStack right)`

## Methods

- `public ItemStack getLeft()`
- `public ItemStack getRight()`
- `public ItemStack getOutput()`
- `public float getBreakChance()`
- `public void setBreakChance(float breakChance)`

## Description

Fired when the player removes a "repaired" item from the Anvil's Output slot.