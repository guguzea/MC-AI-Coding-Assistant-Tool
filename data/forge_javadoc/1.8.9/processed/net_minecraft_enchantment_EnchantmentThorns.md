# EnchantmentThorns

**Inheritance:** java.lang.Object → net.minecraft.enchantment.Enchantment → net.minecraft.enchantment.EnchantmentThorns

## Class signature

```java
public class EnchantmentThorns extends Enchantment
```

## Methods

- `boolean canApply(ItemStack stack)` — Determines if this enchantment can be applied to a specific ItemStack.
- `static boolean func_92094_a(int p_92094_0_, java.util.Random p_92094_1_)`
- `static int func_92095_b(int p_92095_0_, java.util.Random p_92095_1_)`
- `int getMaxEnchantability(int enchantmentLevel)` — Returns the maximum value of enchantability nedded on the enchantment level passed.
- `int getMaxLevel()` — Returns the maximum level that the enchantment can have.
- `int getMinEnchantability(int enchantmentLevel)` — Returns the minimal value of enchantability needed on the enchantment level passed.
- `void onUserHurt(EntityLivingBase user, Entity attacker, int level)` — Whenever an entity that has this enchantment on one of its associated items is damaged this method will be called.

## Fields

- `EnchantmentThorns`