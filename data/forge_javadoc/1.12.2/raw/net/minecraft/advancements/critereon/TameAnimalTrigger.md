---
title: "TameAnimalTrigger"
description: "public class TameAnimalTrigger extends java.lang.Object implements ICriterionTrigger < TameAnimalTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/TameAnimalTrigger.html"
sourceType: javadoc
---

# TameAnimalTrigger

## Class signature

```java
public class TameAnimalTrigger extends java.lang.Object implements ICriterionTrigger < TameAnimalTrigger.Instance >
```

## Constructors

- `public TameAnimalTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < TameAnimalTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < TameAnimalTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public TameAnimalTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, EntityAnimal entity)`
