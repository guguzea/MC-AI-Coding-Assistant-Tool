---
title: "StatFileWriter"
description: "Returns true if the parent has been unlocked, or there is no parent"
package: "net/minecraft/stats"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/stats/StatFileWriter.html"
sourceType: javadoc
---

# StatFileWriter

## Class signature

```java
public class StatFileWriter extends java.lang.Object
```

## Constructors

- `public StatFileWriter()`

## Methods

- `public boolean hasAchievementUnlocked( Achievement achievementIn)`
- `public boolean canUnlockAchievement( Achievement achievementIn)`
- `public void increaseStat( EntityPlayer player, StatBase stat, int amount)`
- `public int func_150874_c( Achievement p_150874_1_)`
- `public void unlockAchievement( EntityPlayer playerIn, StatBase statIn, int p_150873_3_)`
- `public int readStat( StatBase stat)`
- `public <T extends IJsonSerializable > T func_150870_b( StatBase p_150870_1_)`
- `public <T extends IJsonSerializable > T func_150872_a( StatBase p_150872_1_, T p_150872_2_)`

## Description

Returns true if the parent has been unlocked, or there is no parent
