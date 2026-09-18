---
title: "ITextComponent.Serializer"
description: ""
package: "net/minecraft/util/text"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/text/ITextComponent.Serializer.html"
sourceType: javadoc
---

# ITextComponent.Serializer

## Constructors

- `public Serializer()`

## Methods

- `public ITextComponent deserialize(com.google.gson.JsonElement p_deserialize_1_, java.lang.reflect.Type p_deserialize_2_, com.google.gson.JsonDeserializationContext p_deserialize_3_) throws com.google.gson.JsonParseException`
- `public com.google.gson.JsonElement serialize( ITextComponent p_serialize_1_, java.lang.reflect.Type p_serialize_2_, com.google.gson.JsonSerializationContext p_serialize_3_)`
- `public static java.lang.String componentToJson( ITextComponent component)`
- `public static ITextComponent jsonToComponent(java.lang.String json)`
- `public static ITextComponent fromJsonLenient(java.lang.String json)`
