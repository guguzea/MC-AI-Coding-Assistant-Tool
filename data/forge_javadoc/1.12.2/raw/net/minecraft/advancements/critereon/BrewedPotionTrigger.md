---
title: "BrewedPotionTrigger"
description: "public class BrewedPotionTrigger extends java.lang.Object implements ICriterionTrigger<BrewedPotionTrigger.Instance>"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/BrewedPotionTrigger.html"
sourceType: javadoc
---

# BrewedPotionTrigger

**Inheritance:** java.lang.Object → net.minecraft.advancements.critereon.BrewedPotionTrigger

## Class signature

```java
public class BrewedPotionTrigger extends java.lang.Object implements ICriterionTrigger<BrewedPotionTrigger.Instance>
```

## Constructors

- `BrewedPotionTrigger()`

## Methods

- `void addListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BrewedPotionTrigger.Instance> listener)`
- `BrewedPotionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `ResourceLocation getId()`
- `void removeAllListeners(PlayerAdvancements playerAdvancementsIn)`
- `void removeListener(PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener<BrewedPotionTrigger.Instance> listener)`
- `void trigger(EntityPlayerMP player, PotionType potionIn)`
