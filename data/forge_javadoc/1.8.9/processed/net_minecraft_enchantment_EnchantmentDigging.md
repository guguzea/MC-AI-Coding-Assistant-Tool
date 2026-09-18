# EnchantmentDigging

## Class signature

```java
public class EnchantmentDigging extends Enchantment
```

## Constructors

- `protected EnchantmentDigging(int enchID, ResourceLocation enchName, int enchWeight)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public boolean canApply( ItemStack stack)`

## Description

Determines if this enchantment can be applied to a specific ItemStack.