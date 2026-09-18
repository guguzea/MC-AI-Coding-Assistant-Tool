# EnchantmentLevelSetEvent

## Class signature

```java
public class EnchantmentLevelSetEvent extends Event
```

## Constructors

- `public EnchantmentLevelSetEvent( World world, BlockPos pos, int enchantRow, int power, ItemStack itemStack, int level)`

## Methods

- `public World getWorld()`
- `public BlockPos getPos()`
- `public int getEnchantRow()`
- `public int getPower()`
- `public ItemStack getItem()`
- `public int getOriginalLevel()`
- `public int getLevel()`
- `public void setLevel(int level)`

## Description

Fired when the enchantment level is set for each of the three potential enchantments in the enchanting table. The level is set to the vanilla value and can be modified by this event handler. The encha