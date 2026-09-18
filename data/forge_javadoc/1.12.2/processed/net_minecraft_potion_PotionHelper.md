# PotionHelper

## Class signature

```java
public class PotionHelper extends java.lang.Object
```

## Constructors

- `public PotionHelper()`

## Methods

- `public static boolean isReagent( ItemStack stack)`
- `protected static boolean isItemConversionReagent( ItemStack stack)`
- `protected static boolean isTypeConversionReagent( ItemStack stack)`
- `public static boolean hasConversions( ItemStack input, ItemStack reagent)`
- `protected static boolean hasItemConversions( ItemStack input, ItemStack reagent)`
- `protected static boolean hasTypeConversions( ItemStack input, ItemStack reagent)`
- `public static ItemStack doReaction( ItemStack reagent, ItemStack potionIn)`
- `public static void init()`
- `public static void addContainerRecipe( ItemPotion p_193355_0_, Item p_193355_1_, ItemPotion p_193355_2_)`
- `public static void addContainer( ItemPotion p_193354_0_)`
- `public static void addMix( PotionType p_193357_0_, Item p_193357_1_, PotionType p_193357_2_)`
- `public static void addMix( PotionType p_193356_0_, Ingredient p_193356_1_, PotionType p_193356_2_)`