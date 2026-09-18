---
title: "EnterBlockTrigger"
description: "public class EnterBlockTrigger extends java.lang.Object implements ICriterionTrigger < EnterBlockTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/EnterBlockTrigger.html"
sourceType: javadoc
---

# EnterBlockTrigger

## Class signature

```java
public class EnterBlockTrigger extends java.lang.Object implements ICriterionTrigger < EnterBlockTrigger.Instance >
```

## Constructors

- `public EnterBlockTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnterBlockTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < EnterBlockTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public EnterBlockTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, IBlockState state)`
