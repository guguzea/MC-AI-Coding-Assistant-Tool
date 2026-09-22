---
title: "StatBase"
description: "public class StatBase extends java.lang.Object"
package: "net/minecraft/stats"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/stats/StatBase.html"
sourceType: javadoc
---

# StatBase

**Inheritance:** java.lang.Object → net.minecraft.stats.StatBase

## Class signature

```java
public class StatBase extends java.lang.Object
```

## Constructors

- `StatBase(java.lang.String statIdIn, ITextComponent statNameIn)`
- `StatBase(java.lang.String statIdIn, ITextComponent statNameIn, IStatType formatterIn)`

## Methods

- `ITextComponent createChatComponent()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.String format(int number)`
- `IScoreCriteria getCriteria()`
- `java.lang.Class<? extends IJsonSerializable> getSerializableClazz()`
- `ITextComponent getStatName()`
- `int hashCode()`
- `StatBase initIndependentStat()`
- `boolean isAchievement()`
- `StatBase registerStat()`
- `StatBase setSerializableClazz(java.lang.Class<? extends IJsonSerializable> clazz)`
- `java.lang.String toString()`

## Fields

- `static IStatType distanceStatType`
- `static IStatType divideByTen`
- `boolean isIndependent`
- `static IStatType simpleStatType`
- `java.lang.String statId`
- `static IStatType timeStatType`
