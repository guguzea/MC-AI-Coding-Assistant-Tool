---
title: "TileEntityBanner"
description: "public class TileEntityBanner extends TileEntity"
package: "net/minecraft/tileentity"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/tileentity/TileEntityBanner.html"
sourceType: javadoc
---

# TileEntityBanner

**Inheritance:** java.lang.Object → net.minecraft.tileentity.TileEntity → net.minecraft.tileentity.TileEntityBanner

## Class signature

```java
public class TileEntityBanner extends TileEntity
```

## Methods

- `static void addBaseColorTag(ItemStack p_184248_0_, EnumDyeColor p_184248_1_)`
- `int getBaseColor()`
- `static int getBaseColor(ItemStack stack)`
- `java.util.List<EnumDyeColor> getColorList()`
- `java.util.List<TileEntityBanner.EnumBannerPattern> getPatternList()`
- `java.lang.String getPatternResourceLocation()`
- `NBTTagList getPatterns()`
- `static int getPatterns(ItemStack stack)`
- `SPacketUpdateTileEntity getUpdatePacket()`
- `NBTTagCompound getUpdateTag()`
- `void readFromNBT(NBTTagCompound compound)`
- `static void removeBannerData(ItemStack stack)`
- `static void setBaseColorAndPatterns(NBTTagCompound compound, int baseColorIn, NBTTagList patternsIn)`
- `void setItemValues(ItemStack stack)`
- `NBTTagCompound writeToNBT(NBTTagCompound compound)`

## Fields

- `TileEntityBanner`
