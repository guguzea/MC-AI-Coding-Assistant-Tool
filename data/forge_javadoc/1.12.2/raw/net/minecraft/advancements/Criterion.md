---
title: "Criterion"
description: "public class Criterion extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/Criterion.html"
sourceType: javadoc
---

# Criterion

**Inheritance:** java.lang.Object → net.minecraft.advancements.Criterion

## Class signature

```java
public class Criterion extends java.lang.Object
```

## Constructors

- `Criterion()`
- `Criterion(ICriterionInstance p_i47470_1_)`

## Methods

- `static java.util.Map<java.lang.String, Criterion> criteriaFromJson(JsonObject json, JsonDeserializationContext context)`
- `static java.util.Map<java.lang.String, Criterion> criteriaFromNetwork(PacketBuffer bus)`
- `static Criterion criterionFromJson(JsonObject json, JsonDeserializationContext context)`
- `static Criterion criterionFromNetwork(PacketBuffer p_192146_0_)`
- `ICriterionInstance getCriterionInstance()`
- `static void serializeToNetwork(java.util.Map<java.lang.String, Criterion> criteria, PacketBuffer buf)`
- `void serializeToNetwork(PacketBuffer p_192140_1_)`
