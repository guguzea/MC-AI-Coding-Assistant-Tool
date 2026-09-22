# PotionEffect

**Inheritance:** java.lang.Object → net.minecraft.potion.PotionEffect

## Class signature

```java
public class PotionEffect extends java.lang.Object implements java.lang.Comparable<PotionEffect>
```

## Constructors

- `PotionEffect(Potion potionIn)`
- `PotionEffect(PotionEffect other)`
- `PotionEffect(Potion potionIn, int durationIn)`
- `PotionEffect(Potion potionIn, int durationIn, int amplifierIn)`
- `PotionEffect(Potion potionIn, int durationIn, int amplifierIn, boolean ambientIn, boolean showParticlesIn)`

## Methods

- `void addCurativeItem(ItemStack stack)` — Adds the given stack to the list of curative items for this PotionEffect
- `void combine(PotionEffect other)`
- `int compareTo(PotionEffect p_compareTo_1_)`
- `boolean doesShowParticles()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `int getAmplifier()`
- `java.util.List<ItemStack> getCurativeItems()` — Returns a list of curative items for the potion effect By default, this list is initialized using Potion.getCurativeItems()
- `int getDuration()`
- `java.lang.String getEffectName()`
- `boolean getIsAmbient()`
- `boolean getIsPotionDurationMax()`
- `Potion getPotion()`
- `int hashCode()`
- `boolean isCurativeItem(ItemStack stack)` — Checks the given ItemStack to see if it is in the list of curative items for the potion effect
- `boolean onUpdate(EntityLivingBase entityIn)`
- `void performEffect(EntityLivingBase entityIn)`
- `static PotionEffect readCustomPotionEffectFromNBT(NBTTagCompound nbt)`
- `void setCurativeItems(java.util.List<ItemStack> curativeItems)` — Sets the list of curative items for this potion effect, overwriting any already present
- `void setPotionDurationMax(boolean maxDuration)`
- `java.lang.String toString()`
- `NBTTagCompound writeCustomPotionEffectToNBT(NBTTagCompound nbt)`