# EnchantmentDurability

## Class signature

```java
public class EnchantmentDurability extends Enchantment
```

## Constructors

- `protected EnchantmentDurability(int enchID, ResourceLocation enchName, int enchWeight)`

## Methods

- `public int getMinEnchantability(int enchantmentLevel)`
- `public int getMaxEnchantability(int enchantmentLevel)`
- `public int getMaxLevel()`
- `public boolean canApply( ItemStack stack)`
- `public static boolean negateDamage( ItemStack p_92097_0_, int p_92097_1_, java.util.Random p_92097_2_)`

## Description

Determines if this enchantment can be applied to a specific ItemStack.