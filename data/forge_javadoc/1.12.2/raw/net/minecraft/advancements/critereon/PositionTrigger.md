---
title: "PositionTrigger"
description: "public class PositionTrigger extends java.lang.Object implements ICriterionTrigger<PositionTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/PositionTrigger.html"
sourceType: javadoc
---

# PositionTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.PositionTrigger

## Class signature

```java
public class PositionTrigger extends java.lang.Object implements ICriterionTrigger<PositionTrigger.Instance>
```

## Constructors

- `PositionTrigger(ResourceLocation id)`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PositionTrigger.Instance> listener)`
- `PositionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<PositionTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player)`
