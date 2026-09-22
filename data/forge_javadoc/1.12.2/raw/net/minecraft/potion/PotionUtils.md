---
title: "PotionUtils"
description: "public class PotionUtils extends java.lang.Object"
package: "net/minecraft/potion"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/potion/PotionUtils.html"
sourceType: javadoc
---

# PotionUtils

**Inheritance:** java.lang.Object → net.minecraft.potion.PotionUtils

## Class signature

```java
public class PotionUtils extends java.lang.Object
```

## Constructors

- `PotionUtils()`

## Methods

- `static void addCustomPotionEffectToList(NBTTagCompound tag, java.util.List<PotionEffect> effectList)`
- `static ItemStack addPotionToItemStack(ItemStack itemIn, PotionType potionIn)`
- `static void addPotionTooltip(ItemStack itemIn, java.util.List<java.lang.String> lores, float durationFactor)`
- `static ItemStack appendEffects(ItemStack itemIn, java.util.Collection<PotionEffect> effects)`
- `static int getColor(ItemStack p_190932_0_)`
- `static java.util.List<PotionEffect> getEffectsFromStack(ItemStack stack)`
- `static java.util.List<PotionEffect> getEffectsFromTag(NBTTagCompound tag)`
- `static java.util.List<PotionEffect> getFullEffectsFromItem(ItemStack itemIn)`
- `static java.util.List<PotionEffect> getFullEffectsFromTag(NBTTagCompound tag)`
- `static int getPotionColor(PotionType potionIn)`
- `static int getPotionColorFromEffectList(java.util.Collection<PotionEffect> effects)`
- `static PotionType getPotionFromItem(ItemStack itemIn)`
- `static PotionType getPotionTypeFromNBT(NBTTagCompound tag)`
- `static java.util.List<PotionEffect> mergeEffects(PotionType potionIn, java.util.Collection<PotionEffect> effects)`
