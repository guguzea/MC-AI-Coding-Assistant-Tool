---
title: "PotionUtils"
description: "public class PotionUtils extends java.lang.Object"
package: "net/minecraft/potion"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/potion/PotionUtils.html"
sourceType: javadoc
---

# PotionUtils

## Class signature

```java
public class PotionUtils extends java.lang.Object
```

## Constructors

- `public PotionUtils()`

## Methods

- `public static java.util.List< PotionEffect > getEffectsFromStack( ItemStack stack)`
- `public static java.util.List< PotionEffect > mergeEffects( PotionType potionIn, java.util.Collection< PotionEffect > effects)`
- `public static java.util.List< PotionEffect > getEffectsFromTag( NBTTagCompound tag)`
- `public static java.util.List< PotionEffect > getFullEffectsFromItem( ItemStack itemIn)`
- `public static java.util.List< PotionEffect > getFullEffectsFromTag( NBTTagCompound tag)`
- `public static void addCustomPotionEffectToList( NBTTagCompound tag, java.util.List< PotionEffect > effectList)`
- `public static int getColor( ItemStack p_190932_0_)`
- `public static int getPotionColor( PotionType potionIn)`
- `public static int getPotionColorFromEffectList(java.util.Collection< PotionEffect > effects)`
- `public static PotionType getPotionFromItem( ItemStack itemIn)`
- `public static PotionType getPotionTypeFromNBT( NBTTagCompound tag)`
- `public static ItemStack addPotionToItemStack( ItemStack itemIn, PotionType potionIn)`
- `public static ItemStack appendEffects( ItemStack itemIn, java.util.Collection< PotionEffect > effects)`
- `public static void addPotionTooltip( ItemStack itemIn, java.util.List<java.lang.String> lores, float durationFactor)`
