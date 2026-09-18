---
title: "EnchantedItemTrigger"
description: "public class EnchantedItemTrigger extends java.lang.Object implements ICriterionTrigger < EnchantedItemTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EnchantedItemTrigger.html"
sourceType: javadoc
---

# EnchantedItemTrigger

## Class signature

```java
public class EnchantedItemTrigger extends java.lang.Object implements ICriterionTrigger < EnchantedItemTrigger.Instance >
```

## Constructors

- `public EnchantedItemTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnchantedItemTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnchantedItemTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EnchantedItemTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, ItemStack item, int levelsSpent)`
