---
title: "StatisticsManager"
description: "public class StatisticsManager extends java.lang.Object"
package: "net/minecraft/stats"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/stats/StatisticsManager.html"
sourceType: javadoc
---

# StatisticsManager

## Class signature

```java
public class StatisticsManager extends java.lang.Object
```

## Constructors

- `public StatisticsManager()`

## Methods

- `public boolean hasAchievementUnlocked( Achievement achievementIn)`
- `public boolean canUnlockAchievement( Achievement achievementIn)`
- `public void increaseStat( EntityPlayer player, StatBase stat, int amount)`
- `public int countRequirementsUntilAvailable( Achievement achievementIn)`
- `public void unlockAchievement( EntityPlayer playerIn, StatBase statIn, int p_150873_3_)`
- `public int readStat( StatBase stat)`
- `public <T extends IJsonSerializable > T getProgress( StatBase p_150870_1_)`
- `public <T extends IJsonSerializable > T setProgress( StatBase p_150872_1_, T p_150872_2_)`
