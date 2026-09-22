# PotionHelper

**Inheritance:** java.lang.Object → net.minecraft.potion.PotionHelper

## Class signature

```java
public class PotionHelper extends java.lang.Object
```

## Constructors

- `PotionHelper()`

## Methods

- `static void addContainer(ItemPotion p_193354_0_)`
- `static void addContainerRecipe(ItemPotion p_193355_0_, Item p_193355_1_, ItemPotion p_193355_2_)`
- `static void addMix(PotionType p_193356_0_, Ingredient p_193356_1_, PotionType p_193356_2_)`
- `static void addMix(PotionType p_193357_0_, Item p_193357_1_, PotionType p_193357_2_)`
- `static ItemStack doReaction(ItemStack reagent, ItemStack potionIn)`
- `static boolean hasConversions(ItemStack input, ItemStack reagent)`
- `protected static boolean hasItemConversions(ItemStack input, ItemStack reagent)`
- `protected static boolean hasTypeConversions(ItemStack input, ItemStack reagent)`
- `static void init()`
- `protected static boolean isItemConversionReagent(ItemStack stack)`
- `static boolean isReagent(ItemStack stack)`
- `protected static boolean isTypeConversionReagent(ItemStack stack)`