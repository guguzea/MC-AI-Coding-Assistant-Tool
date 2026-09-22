---
title: "TameAnimalTrigger"
description: "public class TameAnimalTrigger extends java.lang.Object implements ICriterionTrigger<TameAnimalTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/TameAnimalTrigger.html"
sourceType: javadoc
---

# TameAnimalTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.TameAnimalTrigger

## Class signature

```java
public class TameAnimalTrigger extends java.lang.Object implements ICriterionTrigger<TameAnimalTrigger.Instance>
```

## Constructors

- `TameAnimalTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TameAnimalTrigger.Instance> listener)`
- `TameAnimalTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<TameAnimalTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityAnimal entity)`
