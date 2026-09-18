---
title: "ITextComponent.Serializer"
description: ""
package: "net/minecraft/util/text"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/text/ITextComponent.Serializer.html"
sourceType: javadoc
---

# ITextComponent.Serializer

## Constructors

- `public Serializer()`

## Methods

- `public ITextComponent deserialize(JsonElement p_deserialize_1_, java.lang.reflect.Type p_deserialize_2_, JsonDeserializationContext p_deserialize_3_) throws JsonParseException`
- `public JsonElement serialize( ITextComponent p_serialize_1_, java.lang.reflect.Type p_serialize_2_, JsonSerializationContext p_serialize_3_)`
- `public static java.lang.String componentToJson( ITextComponent component)`
- `public static ITextComponent jsonToComponent(java.lang.String json)`
- `public static ITextComponent fromJsonLenient(java.lang.String json)`
