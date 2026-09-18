---
title: "LootFunction.Serializer"
description: ""
package: "net/minecraft/world/storage/loot/functions"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/world/storage/loot/functions/LootFunction.Serializer.html"
sourceType: javadoc
---

# LootFunction.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getFunctionName()`
- `public java.lang.Class< T > getFunctionClass()`
- `public abstract void serialize(com.google.gson.JsonObject object, T functionClazz, com.google.gson.JsonSerializationContext serializationContext)`
- `public abstract T deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, LootCondition [] conditionsIn)`
