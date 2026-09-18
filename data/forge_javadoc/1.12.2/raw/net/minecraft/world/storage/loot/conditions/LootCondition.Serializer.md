---
title: "LootCondition.Serializer"
description: ""
package: "net/minecraft/world/storage/loot/conditions"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/conditions/LootCondition.Serializer.html"
sourceType: javadoc
---

# LootCondition.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getLootTableLocation()`
- `public java.lang.Class< T > getConditionClass()`
- `public abstract void serialize(JsonObject json, T value, JsonSerializationContext context)`
- `public abstract T deserialize(JsonObject json, JsonDeserializationContext context)`
