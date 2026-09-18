---
title: "RecipeUnlockedTrigger"
description: "public class RecipeUnlockedTrigger extends java.lang.Object implements ICriterionTrigger < RecipeUnlockedTrigger.Instance >"
package: "net/minecraft/advancements/critereon"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/critereon/RecipeUnlockedTrigger.html"
sourceType: javadoc
---

# RecipeUnlockedTrigger

## Class signature

```java
public class RecipeUnlockedTrigger extends java.lang.Object implements ICriterionTrigger < RecipeUnlockedTrigger.Instance >
```

## Constructors

- `public RecipeUnlockedTrigger()`

## Methods

- `public ResourceLocation getId()`
- `public void addListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < RecipeUnlockedTrigger.Instance > listener)`
- `public void removeListener( PlayerAdvancements playerAdvancementsIn, ICriterionTrigger.Listener < RecipeUnlockedTrigger.Instance > listener)`
- `public void removeAllListeners( PlayerAdvancements playerAdvancementsIn)`
- `public RecipeUnlockedTrigger.Instance deserializeInstance(JsonObject json, JsonDeserializationContext context)`
- `public void trigger( EntityPlayerMP player, IRecipe recipe)`
