# EnchantmentUntouching

**Inheritance:** java.lang.Object → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentUntouching

## Class signature

```java
public class EnchantmentUntouching extends Enchantment
```

## Methods

- `boolean canApply(ItemStack stack)` — Determines if this enchantment can be applied to a specific ItemStack.
- `boolean canApplyTogether(Enchantment ench)` — Determines if the enchantment passed can be applyied together with this enchantment.
- `int getMaxEnchantability(int enchantmentLevel)` — Returns the maximum value of enchantability nedded on the enchantment level passed.
- `int getMaxLevel()` — Returns the maximum level that the enchantment can have.
- `int getMinEnchantability(int enchantmentLevel)` — Returns the minimal value of enchantability needed on the enchantment level passed.

## Fields

- `protected EnchantmentUntouching`