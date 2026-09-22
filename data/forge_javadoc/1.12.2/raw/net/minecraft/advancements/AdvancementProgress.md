---
title: "AdvancementProgress"
description: "public class AdvancementProgress extends java.lang.Object implements java.lang.Comparable<AdvancementProgress>"
package: "net/minecraft/advancements"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/AdvancementProgress.html"
sourceType: javadoc
---

# AdvancementProgress

**Inheritance:** java.lang.Object → net.minecraft.advancements.AdvancementProgress

## Class signature

```java
public class AdvancementProgress extends java.lang.Object implements java.lang.Comparable<AdvancementProgress>
```

## Constructors

- `AdvancementProgress()`

## Methods

- `int compareTo(AdvancementProgress p_compareTo_1_)`
- `static AdvancementProgress fromNetwork(PacketBuffer p_192100_0_)`
- `java.lang.Iterable<java.lang.String> getCompletedCriteria()`
- `CriterionProgress getCriterionProgress(java.lang.String criterionIn)`
- `java.util.Date getFirstProgressDate()`
- `float getPercent()`
- `java.lang.String getProgressText()`
- `java.lang.Iterable<java.lang.String> getRemaningCriteria()`
- `boolean grantCriterion(java.lang.String criterionIn)`
- `boolean hasProgress()`
- `boolean isDone()`
- `boolean revokeCriterion(java.lang.String criterionIn)`
- `void serializeToNetwork(PacketBuffer p_192104_1_)`
- `java.lang.String toString()`
- `void update(java.util.Map<java.lang.String, Criterion> criteriaIn, java.lang.String[][] requirements)`
