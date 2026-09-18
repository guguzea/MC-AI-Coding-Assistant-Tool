---
title: "EffectsChangedTrigger"
description: "public class EffectsChangedTrigger extends java.lang.Object implements ICriterionTrigger < EffectsChangedTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EffectsChangedTrigger.html"
sourceType: javadoc
---

# EffectsChangedTrigger

## Class signature

```java
public class EffectsChangedTrigger extends java.lang.Object implements ICriterionTrigger < EffectsChangedTrigger.Instance >
```

## Constructors

- `public EffectsChangedTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EffectsChangedTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EffectsChangedTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EffectsChangedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player)`
