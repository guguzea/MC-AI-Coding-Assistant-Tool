---
title: "Criterion"
description: "public class Criterion extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/Criterion.html"
sourceType: javadoc
---

# Criterion

## Class signature

```java
public class Criterion extends java.lang.Object
```

## Constructors

- `public Criterion( ICriterionInstance p_i47470_1_)`
- `public Criterion()`

## Methods

- `public void serializeToNetwork( PacketBuffer p_192140_1_)`
- `public static Criterion criterionFromJson(JsonObject json, JsonDeserializationContext context)`
- `public static Criterion criterionFromNetwork( PacketBuffer p_192146_0_)`
- `public static java.util.Map<java.lang.String, Criterion > criteriaFromJson(JsonObject json, JsonDeserializationContext context)`
- `public static java.util.Map<java.lang.String, Criterion > criteriaFromNetwork( PacketBuffer bus)`
- `public static void serializeToNetwork(java.util.Map<java.lang.String, Criterion > criteria, PacketBuffer buf)`
- `public ICriterionInstance getCriterionInstance()`
