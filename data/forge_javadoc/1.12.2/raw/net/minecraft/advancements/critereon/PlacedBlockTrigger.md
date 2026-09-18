---
title: "PlacedBlockTrigger"
description: "public class PlacedBlockTrigger extends java.lang.Object implements ICriterionTrigger < PlacedBlockTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/PlacedBlockTrigger.html"
sourceType: javadoc
---

# PlacedBlockTrigger

## Class signature

```java
public class PlacedBlockTrigger extends java.lang.Object implements ICriterionTrigger < PlacedBlockTrigger.Instance >
```

## Constructors

- `public PlacedBlockTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PlacedBlockTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < PlacedBlockTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public PlacedBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, BlockPos pos, ItemStack item)`
