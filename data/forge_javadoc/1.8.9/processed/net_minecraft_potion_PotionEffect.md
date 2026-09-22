# PotionEffect

**Inheritance:** java.lang.Object → net.minecraft.potion.PotionEffect

## Class signature

```java
public class PotionEffect extends java.lang.Object
```

## Constructors

- `PotionEffect(int id, int effectDuration)`
- `PotionEffect(int id, int effectDuration, int effectAmplifier)`
- `PotionEffect(int id, int effectDuration, int effectAmplifier, boolean ambient, boolean showParticles)`
- `PotionEffect(PotionEffect other)`

## Methods

- `void addCurativeItem(ItemStack stack)` — Adds the given stack to list of curative items for the potion effect
- `void combine(PotionEffect other)` — merges the input PotionEffect into this one if this.amplifier <= tomerge.amplifier.
- `boolean equals(java.lang.Object p_equals_1_)`
- `int getAmplifier()`
- `java.util.List<ItemStack> getCurativeItems()` — Returns a list of curative items for the potion effect
- `int getDuration()`
- `java.lang.String getEffectName()`
- `boolean getIsAmbient()` — Gets whether this potion effect originated from a beacon
- `boolean getIsPotionDurationMax()`
- `boolean getIsShowParticles()`
- `int getPotionID()` — Retrieve the ID of the potion this effect matches.
- `int hashCode()`
- `boolean isCurativeItem(ItemStack stack)` — Checks the given ItemStack to see if it is in the list of curative items for the potion effect
- `boolean onUpdate(EntityLivingBase entityIn)`
- `void performEffect(EntityLivingBase entityIn)`
- `static PotionEffect readCustomPotionEffectFromNBT(NBTTagCompound nbt)` — Read a custom potion effect from a potion item's NBT data.
- `void setCurativeItems(java.util.List<ItemStack> curativeItems)` — Sets the array of curative items for the potion effect
- `void setPotionDurationMax(boolean maxDuration)` — Toggle the isPotionDurationMax field.
- `void setSplashPotion(boolean splashPotion)` — Set whether this potion is a splash potion.
- `java.lang.String toString()`
- `NBTTagCompound writeCustomPotionEffectToNBT(NBTTagCompound nbt)` — Write a custom potion effect to a potion item's NBT data.