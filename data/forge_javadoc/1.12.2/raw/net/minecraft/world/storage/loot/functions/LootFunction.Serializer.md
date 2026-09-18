---
title: "LootFunction.Serializer"
description: ""
package: "net/minecraft/world/storage/loot/functions"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/functions/LootFunction.Serializer.html"
sourceType: javadoc
---

# LootFunction.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getFunctionName()`
- `public java.lang.Class< T > getFunctionClass()`
- `public abstract void serialize(JsonObject object, T functionClazz, JsonSerializationContext serializationContext)`
- `public abstract T deserialize(JsonObject object, JsonDeserializationContext deserializationContext, LootCondition [] conditionsIn)`
