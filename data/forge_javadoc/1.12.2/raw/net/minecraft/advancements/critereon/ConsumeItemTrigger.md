---
title: "ConsumeItemTrigger"
description: "public class ConsumeItemTrigger extends java.lang.Object implements ICriterionTrigger < ConsumeItemTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/ConsumeItemTrigger.html"
sourceType: javadoc
---

# ConsumeItemTrigger

## Class signature

```java
public class ConsumeItemTrigger extends java.lang.Object implements ICriterionTrigger < ConsumeItemTrigger.Instance >
```

## Constructors

- `public ConsumeItemTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ConsumeItemTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < ConsumeItemTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public ConsumeItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, ItemStack item)`
