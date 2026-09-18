---
title: "LootCondition.Serializer"
description: ""
package: "net/minecraft/world/storage/loot/conditions"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/conditions/LootCondition.Serializer.html"
sourceType: javadoc
---

# LootCondition.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getLootTableLocation()`
- `public java.lang.Class< T > getConditionClass()`
- `public abstract void serialize(com.google.gson.JsonObject json, T value, com.google.gson.JsonSerializationContext context)`
- `public abstract T deserialize(com.google.gson.JsonObject json, com.google.gson.JsonDeserializationContext context)`
