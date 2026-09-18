---
title: "UsedTotemTrigger"
description: "public class UsedTotemTrigger extends java.lang.Object implements ICriterionTrigger < UsedTotemTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/UsedTotemTrigger.html"
sourceType: javadoc
---

# UsedTotemTrigger

## Class signature

```java
public class UsedTotemTrigger extends java.lang.Object implements ICriterionTrigger < UsedTotemTrigger.Instance >
```

## Constructors

- `public UsedTotemTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < UsedTotemTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < UsedTotemTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public UsedTotemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, ItemStack item)`
