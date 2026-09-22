---
title: "Advancement.Builder"
description: "public static class Advancement.Builder extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/Advancement.Builder.html"
sourceType: javadoc
---

# Advancement.Builder

**Inheritance:** java.lang.Object → net.minecraft.advancements.Advancement.Builder

## Class signature

```java
public static class Advancement.Builder extends java.lang.Object
```

## Methods

- `Advancement build(ResourceLocation id)`
- `static Advancement.Builder deserialize(JsonObject json, JsonDeserializationContext context)`
- `static Advancement.Builder readFrom(PacketBuffer buf)`
- `boolean resolveParent(java.util.function.Function<ResourceLocation, Advancement> lookup)`
- `java.lang.String toString()`
- `void writeTo(PacketBuffer buf)`
