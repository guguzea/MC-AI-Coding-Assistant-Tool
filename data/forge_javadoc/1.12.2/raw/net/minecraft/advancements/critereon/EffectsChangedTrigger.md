---
title: "EffectsChangedTrigger"
description: "public class EffectsChangedTrigger extends java.lang.Object implements ICriterionTrigger<EffectsChangedTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EffectsChangedTrigger.html"
sourceType: javadoc
---

# EffectsChangedTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.EffectsChangedTrigger

## Class signature

```java
public class EffectsChangedTrigger extends java.lang.Object implements ICriterionTrigger<EffectsChangedTrigger.Instance>
```

## Constructors

- `EffectsChangedTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EffectsChangedTrigger.Instance> listener)`
- `EffectsChangedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<EffectsChangedTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player)`
