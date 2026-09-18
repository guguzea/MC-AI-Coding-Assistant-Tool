---
title: "ChangeDimensionTrigger"
description: "public class ChangeDimensionTrigger extends java.lang.Object implements ICriterionTrigger < ChangeDimensionTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ChangeDimensionTrigger.html"
sourceType: javadoc
---

# ChangeDimensionTrigger

## Class signature

```java
public class ChangeDimensionTrigger extends java.lang.Object implements ICriterionTrigger < ChangeDimensionTrigger.Instance >
```

## Constructors

- `public ChangeDimensionTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ChangeDimensionTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ChangeDimensionTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public ChangeDimensionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, DimensionType from, DimensionType to)`
