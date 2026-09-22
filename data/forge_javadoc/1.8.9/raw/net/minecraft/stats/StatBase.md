---
title: "StatBase"
description: "public class StatBase extends java.lang.Object"
package: "net/minecraft/stats"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/stats/StatBase.html"
sourceType: javadoc
---

# StatBase

**Inheritance:** java.lang.Object → net.minecraft.stats.StatBase

## Class signature

```java
public class StatBase extends java.lang.Object
```

## Constructors

- `StatBase(java.lang.String statIdIn, IChatComponent statNameIn)`
- `StatBase(java.lang.String statIdIn, IChatComponent statNameIn, IStatType typeIn)`

## Methods

- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.String format(int p_75968_1_)`
- `IScoreObjectiveCriteria func_150952_k()`
- `StatBase func_150953_b(java.lang.Class<? extends IJsonSerializable> p_150953_1_)`
- `java.lang.Class<? extends IJsonSerializable> func_150954_l()`
- `IChatComponent func_150955_j()`
- `IChatComponent getStatName()`
- `int hashCode()`
- `StatBase initIndependentStat()` — Initializes the current stat as independent (i.e., lacking prerequisites for being updated) and returns the current instance.
- `boolean isAchievement()` — Returns whether or not the StatBase-derived class is a statistic (running counter) or an achievement (one-shot).
- `StatBase registerStat()` — Register the stat into StatList.
- `java.lang.String toString()`

## Fields

- `static IStatType distanceStatType`
- `static IStatType field_111202_k`
- `boolean isIndependent`
- `static IStatType simpleStatType`
- `java.lang.String statId` — The Stat ID
- `static IStatType timeStatType`
