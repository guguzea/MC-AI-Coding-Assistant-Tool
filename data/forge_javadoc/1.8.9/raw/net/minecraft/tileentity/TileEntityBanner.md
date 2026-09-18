---
title: "TileEntityBanner"
description: "Allows for a specialized description packet to be created."
package: "net/minecraft/tileentity"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityBanner.html"
sourceType: javadoc
---

# TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity
```

## Constructors

- `public TileEntityBanner()`

## Methods

- `public void setItemValues( ItemStack stack)`
- `public void writeToNBT( NBTTagCompound compound)`
- `public static void func_181020_a( NBTTagCompound p_181020_0_, int p_181020_1_, NBTTagList p_181020_2_)`
- `public void readFromNBT( NBTTagCompound compound)`
- `public Packet getDescriptionPacket()`
- `public int getBaseColor()`
- `public static int getBaseColor( ItemStack stack)`
- `public static int getPatterns( ItemStack stack)`
- `public java.util.List< TileEntityBanner.EnumBannerPattern > getPatternList()`
- `public NBTTagList func_181021_d()`
- `public java.util.List< EnumDyeColor > getColorList()`
- `public static void removeBannerData( ItemStack stack)`
- `public java.lang.String func_175116_e()`

## Description

Allows for a specialized description packet to be created.
