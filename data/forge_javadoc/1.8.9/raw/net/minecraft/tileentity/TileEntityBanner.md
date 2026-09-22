---
title: "TileEntityBanner"
description: "public class TileEntityBanner extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/tileentity/TileEntityBanner.html"
sourceType: javadoc
---

# TileEntityBanner

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity
```

## Methods

- `java.lang.String func_175116_e()`
- `static void func_181020_a(NBTTagCompound p_181020_0_, int p_181020_1_, NBTTagList p_181020_2_)`
- `NBTTagList func_181021_d()`
- `int getBaseColor()`
- `static int getBaseColor(ItemStack stack)`
- `java.util.List<EnumDyeColor> getColorList()`
- `Packet getDescriptionPacket()` — Allows for a specialized description packet to be created.
- `java.util.List<TileEntityBanner.EnumBannerPattern> getPatternList()`
- `static int getPatterns(ItemStack stack)` — Retrieves the amount of patterns stored on an ItemStack.
- `void readFromNBT(NBTTagCompound compound)`
- `static void removeBannerData(ItemStack stack)` — Removes all the banner related data from a provided instance of ItemStack.
- `void setItemValues(ItemStack stack)`
- `void writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityBanner`
