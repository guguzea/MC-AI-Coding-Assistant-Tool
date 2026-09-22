---
title: "StatisticsManager"
description: "public class StatisticsManager extends java.lang.Object"
package: "net/minecraft/stats"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/stats/StatisticsManager.html"
sourceType: javadoc
---

# StatisticsManager

**Inheritance:** java.lang.Object → net.minecraft.stats.StatisticsManager

## Class signature

```java
public class StatisticsManager extends java.lang.Object
```

## Constructors

- `StatisticsManager()`

## Methods

- `boolean canUnlockAchievement(Achievement achievementIn)`
- `int countRequirementsUntilAvailable(Achievement achievementIn)`
- `<T extends IJsonSerializable> T getProgress(StatBase p_150870_1_)`
- `boolean hasAchievementUnlocked(Achievement achievementIn)`
- `void increaseStat(EntityPlayer player, StatBase stat, int amount)`
- `int readStat(StatBase stat)`
- `<T extends IJsonSerializable> T setProgress(StatBase p_150872_1_, T p_150872_2_)`
- `void unlockAchievement(EntityPlayer playerIn, StatBase statIn, int p_150873_3_)`

## Fields

- `protected java.util.Map<StatBase, TupleIntJsonSerializable> statsData`
