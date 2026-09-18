---
title: "PotionEffect"
description: "Adds the given stack to list of curative items for the potion effect"
package: "net/minecraft/potion"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/potion/PotionEffect.html"
sourceType: javadoc
---

# PotionEffect

## Class signature

```java
public class PotionEffect extends java.lang.Object implements java.lang.Comparable< PotionEffect >
```

## Constructors

- `public PotionEffect( Potion potionIn)`
- `public PotionEffect( Potion potionIn, int durationIn)`
- `public PotionEffect( Potion potionIn, int durationIn, int amplifierIn)`
- `public PotionEffect( Potion potionIn, int durationIn, int amplifierIn, boolean ambientIn, boolean showParticlesIn)`
- `public PotionEffect( PotionEffect other)`

## Methods

- `public void combine( PotionEffect other)`
- `public Potion getPotion()`
- `public int getDuration()`
- `public int getAmplifier()`
- `public boolean getIsAmbient()`
- `public boolean doesShowParticles()`
- `public boolean onUpdate( EntityLivingBase entityIn)`
- `public void performEffect( EntityLivingBase entityIn)`
- `public java.lang.String getEffectName()`
- `public java.lang.String toString()`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public NBTTagCompound writeCustomPotionEffectToNBT( NBTTagCompound nbt)`
- `public static PotionEffect readCustomPotionEffectFromNBT( NBTTagCompound nbt)`
- `public void setPotionDurationMax(boolean maxDuration)`
- `public int compareTo( PotionEffect p_compareTo_1_)`
- `public boolean getIsPotionDurationMax()`
- `public java.util.List< ItemStack > getCurativeItems()`
- `public boolean isCurativeItem( ItemStack stack)`
- `public void setCurativeItems(java.util.List< ItemStack > curativeItems)`
- `public void addCurativeItem( ItemStack stack)`

## Description

Adds the given stack to list of curative items for the potion effect
