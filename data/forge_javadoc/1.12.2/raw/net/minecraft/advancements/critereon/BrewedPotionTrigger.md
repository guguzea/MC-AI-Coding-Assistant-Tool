---
title: "BrewedPotionTrigger"
description: "public class BrewedPotionTrigger extends java.lang.Object implements ICriterionTrigger < BrewedPotionTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/BrewedPotionTrigger.html"
sourceType: javadoc
---

# BrewedPotionTrigger

## Class signature

```java
public class BrewedPotionTrigger extends java.lang.Object implements ICriterionTrigger < BrewedPotionTrigger.Instance >
```

## Constructors

- `public BrewedPotionTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BrewedPotionTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BrewedPotionTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public BrewedPotionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, PotionType potionIn)`
