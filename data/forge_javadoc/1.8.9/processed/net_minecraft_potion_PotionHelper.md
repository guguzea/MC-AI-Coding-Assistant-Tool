# PotionHelper

**Inheritance:** java.lang.Object → net.minecraft.potion.PotionHelper

## Class signature

```java
public class PotionHelper extends java.lang.Object
```

## Constructors

- `PotionHelper()`

## Methods

- `static int applyIngredient(int p_77913_0_, java.lang.String p_77913_1_)` — Returns the new potion damage value after the specified ingredient info is applied to the specified potion.
- `static int calcPotionLiquidColor(java.util.Collection<PotionEffect> p_77911_0_)` — Given a Collection PotionEffect > will return an Integer color.
- `static boolean checkFlag(int p_77914_0_, int p_77914_1_)` — Checks if the bit at 1 << j is on in i.
- `static int func_77908_a(int p_77908_0_, int p_77908_1_, int p_77908_2_, int p_77908_3_, int p_77908_4_, int p_77908_5_)`
- `static boolean getAreAmbient(java.util.Collection<PotionEffect> potionEffects)` — Check whether a Collection PotionEffect > are all ambient.
- `static int getLiquidColor(int dataValue, boolean bypassCache)` — Given a potion data value, get the associated liquid color (optionally bypassing the cache)
- `static java.util.List<PotionEffect> getPotionEffects(int p_77917_0_, boolean p_77917_1_)`
- `static java.lang.String getPotionPrefix(int dataValue)` — Given a potion data value, get its prefix as a translation ID.
- `static int getPotionPrefixIndex(int dataValue)` — Given a potion data value, get its prefix index number.

## Fields

- `static java.lang.String blazePowderEffect`
- `static java.lang.String fermentedSpiderEyeEffect`
- `static java.lang.String field_77924_a`
- `static java.lang.String ghastTearEffect`
- `static java.lang.String glowstoneEffect`
- `static java.lang.String goldenCarrotEffect`
- `static java.lang.String gunpowderEffect`
- `static java.lang.String magmaCreamEffect`
- `static java.lang.String pufferfishEffect`
- `static java.lang.String rabbitFootEffect`
- `static java.lang.String redstoneEffect`
- `static java.lang.String speckledMelonEffect`
- `static java.lang.String spiderEyeEffect`
- `static java.lang.String sugarEffect`