---
title: "TickTrigger"
description: "public class TickTrigger extends java.lang.Object implements ICriterionTrigger < TickTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/TickTrigger.html"
sourceType: javadoc
---

# TickTrigger

## Class signature

```java
public class TickTrigger extends java.lang.Object implements ICriterionTrigger < TickTrigger.Instance >
```

## Constructors

- `public TickTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < TickTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < TickTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public TickTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player)`
