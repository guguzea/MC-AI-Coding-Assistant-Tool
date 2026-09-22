---
title: "Advancement"
description: "public class Advancement extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/Advancement.html"
sourceType: javadoc
---

# Advancement

**Inheritance:** java.lang.Object → net.minecraft.advancements.Advancement

## Class signature

```java
public class Advancement extends java.lang.Object
```

## Constructors

- `Advancement(ResourceLocation id, Advancement parentIn, DisplayInfo displayIn, AdvancementRewards rewardsIn, java.util.Map<java.lang.String, Criterion> criteriaIn, java.lang.String[][] requirementsIn)`

## Methods

- `void addChild(Advancement advancementIn)`
- `Advancement.Builder copy()`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.lang.Iterable<Advancement> getChildren()`
- `java.util.Map<java.lang.String, Criterion> getCriteria()`
- `DisplayInfo getDisplay()`
- `ITextComponent getDisplayText()`
- `ResourceLocation getId()`
- `Advancement getParent()`
- `int getRequirementCount()`
- `java.lang.String[][] getRequirements()`
- `AdvancementRewards getRewards()`
- `int hashCode()`
- `java.lang.String toString()`
