# PotionHelper

**Inheritance:** java.lang.Object → net.minecraft.potion.PotionHelper

## Class signature

```java
public class PotionHelper extends java.lang.Object
```

## Constructors

- `PotionHelper()`

## Methods

- `static ItemStack doReaction(ItemStack reagent, ItemStack potionIn)`
- `static boolean hasConversions(ItemStack input, ItemStack reagent)`
- `protected static boolean hasItemConversions(ItemStack p_185206_0_, ItemStack p_185206_1_)`
- `protected static boolean hasTypeConversions(ItemStack p_185209_0_, ItemStack p_185209_1_)`
- `static void init()`
- `protected static boolean isItemConversionReagent(ItemStack stack)`
- `static boolean isReagent(ItemStack stack)`
- `protected static boolean isTypeConversionReagent(ItemStack stack)`
- `static void registerPotionItem(PotionHelper.ItemPredicateInstance p_185202_0_)`
- `static void registerPotionItemConversion(ItemPotion p_185201_0_, PotionHelper.ItemPredicateInstance p_185201_1_, ItemPotion p_185201_2_)`
- `static void registerPotionTypeConversion(PotionType input, com.google.common.base.Predicate<ItemStack> reagentPredicate, PotionType output)`