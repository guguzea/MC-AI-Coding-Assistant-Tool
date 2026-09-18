---
title: "PositionTrigger"
description: "public class PositionTrigger extends java.lang.Object implements ICriterionTrigger < PositionTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/PositionTrigger.html"
sourceType: javadoc
---

# PositionTrigger

## Class signature

```java
public class PositionTrigger extends java.lang.Object implements ICriterionTrigger < PositionTrigger.Instance >
```

## Constructors

- `public PositionTrigger( ResourceLocation id)`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PositionTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PositionTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public PositionTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player)`
