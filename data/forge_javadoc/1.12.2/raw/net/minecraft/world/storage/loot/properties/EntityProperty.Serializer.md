---
title: "EntityProperty.Serializer"
description: ""
package: "net/minecraft/world/storage/loot/properties"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/properties/EntityProperty.Serializer.html"
sourceType: javadoc
---

# EntityProperty.Serializer

## Constructors

- `protected Serializer( ResourceLocation nameIn, java.lang.Class< T > propertyClassIn)`

## Methods

- `public ResourceLocation getName()`
- `public java.lang.Class< T > getPropertyClass()`
- `public abstract JsonElement serialize( T property, JsonSerializationContext serializationContext)`
- `public abstract T deserialize(JsonElement element, JsonDeserializationContext deserializationContext)`
