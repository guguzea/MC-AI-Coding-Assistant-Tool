---
title: "Achievement"
description: "public class Achievement extends StatBase"
package: "net/minecraft/stats"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/stats/Achievement.html"
sourceType: javadoc
---

# Achievement

**Inheritance:** java.lang.Object → net.minecraft.stats.StatBase → net.minecraft.stats.Achievement

## Class signature

```java
public class Achievement extends StatBase
```

## Constructors

- `Achievement(java.lang.String statIdIn, java.lang.String unlocalizedName, int column, int row, Block blockIn, Achievement parent)`
- `Achievement(java.lang.String statIdIn, java.lang.String unlocalizedName, int column, int row, Item itemIn, Achievement parent)`
- `Achievement(java.lang.String statIdIn, java.lang.String unlocalizedName, int column, int row, ItemStack stack, Achievement parent)`

## Methods

- `java.lang.String getDescription()`
- `boolean getSpecial()`
- `ITextComponent getStatName()`
- `Achievement initIndependentStat()`
- `boolean isAchievement()`
- `Achievement registerStat()`
- `Achievement setSerializableClazz(java.lang.Class<? extends IJsonSerializable> clazz)`
- `Achievement setSpecial()`
- `Achievement setStatStringFormatter(IStatStringFormat statStringFormatterIn)`

## Fields

- `int displayColumn`
- `int displayRow`
- `Achievement parentAchievement`
- `ItemStack theItemStack`
