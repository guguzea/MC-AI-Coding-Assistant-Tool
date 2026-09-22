---
title: "TickTrigger"
description: "public class TickTrigger extends java.lang.Object implements ICriterionTrigger<TickTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/TickTrigger.html"
sourceType: javadoc
---

# TickTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.TickTrigger

## Class signature

```java
public class TickTrigger extends java.lang.Object implements ICriterionTrigger<TickTrigger.Instance>
```

## Constructors

- `TickTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TickTrigger.Instance> listener)`
- `TickTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TickTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player)`

## Fields

- `static ResourceLocation ID`
