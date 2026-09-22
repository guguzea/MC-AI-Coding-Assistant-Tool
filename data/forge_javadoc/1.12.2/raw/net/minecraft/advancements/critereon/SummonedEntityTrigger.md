---
title: "SummonedEntityTrigger"
description: "public class SummonedEntityTrigger extends java.lang.Object implements ICriterionTrigger<SummonedEntityTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/SummonedEntityTrigger.html"
sourceType: javadoc
---

# SummonedEntityTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.SummonedEntityTrigger

## Class signature

```java
public class SummonedEntityTrigger extends java.lang.Object implements ICriterionTrigger<SummonedEntityTrigger.Instance>
```

## Constructors

- `SummonedEntityTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<SummonedEntityTrigger.Instance> listener)`
- `SummonedEntityTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<SummonedEntityTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, Entity entity)`
