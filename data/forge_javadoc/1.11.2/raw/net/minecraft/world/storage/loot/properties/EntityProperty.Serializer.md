---
title: "EntityProperty.Serializer"
description: ""
package: "net/minecraft/world/storage/loot/properties"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/loot/properties/EntityProperty.Serializer.html"
sourceType: javadoc
---

# EntityProperty.Serializer

## Constructors

- `protected Serializer( ResourceLocation nameIn, java.lang.Class< T > propertyClassIn)`

## Methods

- `public ResourceLocation getName()`
- `public java.lang.Class< T > getPropertyClass()`
- `public abstract com.google.gson.JsonElement serialize( T property, com.google.gson.JsonSerializationContext serializationContext)`
- `public abstract T deserialize(com.google.gson.JsonElement element, com.google.gson.JsonDeserializationContext deserializationContext)`
