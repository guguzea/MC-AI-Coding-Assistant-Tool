---
title: "BredAnimalsTrigger"
description: "public class BredAnimalsTrigger extends java.lang.Object implements ICriterionTrigger < BredAnimalsTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/BredAnimalsTrigger.html"
sourceType: javadoc
---

# BredAnimalsTrigger

## Class signature

```java
public class BredAnimalsTrigger extends java.lang.Object implements ICriterionTrigger < BredAnimalsTrigger.Instance >
```

## Constructors

- `public BredAnimalsTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BredAnimalsTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < BredAnimalsTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public BredAnimalsTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityAnimal parent1, EntityAnimal parent2, EntityAgeable child)`
