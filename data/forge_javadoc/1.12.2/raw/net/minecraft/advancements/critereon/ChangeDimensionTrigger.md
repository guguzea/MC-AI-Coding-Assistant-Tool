---
title: "ChangeDimensionTrigger"
description: "public class ChangeDimensionTrigger extends java.lang.Object implements ICriterionTrigger<ChangeDimensionTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ChangeDimensionTrigger.html"
sourceType: javadoc
---

# ChangeDimensionTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.ChangeDimensionTrigger

## Class signature

```java
public class ChangeDimensionTrigger extends java.lang.Object implements ICriterionTrigger<ChangeDimensionTrigger.Instance>
```

## Constructors

- `ChangeDimensionTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ChangeDimensionTrigger.Instance> listener)`
- `ChangeDimensionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<ChangeDimensionTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, DimensionType from, DimensionType to)`
