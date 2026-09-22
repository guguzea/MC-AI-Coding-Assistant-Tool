---
title: "BredAnimalsTrigger"
description: "public class BredAnimalsTrigger extends java.lang.Object implements ICriterionTrigger<BredAnimalsTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/BredAnimalsTrigger.html"
sourceType: javadoc
---

# BredAnimalsTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.BredAnimalsTrigger

## Class signature

```java
public class BredAnimalsTrigger extends java.lang.Object implements ICriterionTrigger<BredAnimalsTrigger.Instance>
```

## Constructors

- `BredAnimalsTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BredAnimalsTrigger.Instance> listener)`
- `BredAnimalsTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BredAnimalsTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, EntityAnimal parent1, EntityAnimal parent2, EntityAgeable child)`
