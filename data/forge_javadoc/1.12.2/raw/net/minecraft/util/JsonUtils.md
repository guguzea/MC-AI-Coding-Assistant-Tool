---
title: "JsonUtils"
description: "public class JsonUtils extends java.lang.Object"
package: "net/minecraft/util"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/util/JsonUtils.html"
sourceType: javadoc
---

# JsonUtils

**Inheritance:** java.lang.Object → net.minecraft.util.JsonUtils

## Class signature

```java
public class JsonUtils extends java.lang.Object
```

## Constructors

- `JsonUtils()`

## Methods

- `static<T> T deserializeClass(JsonElement json, java.lang.String memberName, JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `static<T> T deserializeClass(JsonObject json, java.lang.String memberName, JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `static<T> T deserializeClass(JsonObject json, java.lang.String memberName, T fallback, JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `static<T> T fromJson(Gson p_193839_0_, java.io.Reader p_193839_1_, java.lang.Class<T> p_193839_2_)`
- `static<T> T fromJson(Gson p_193841_0_, java.io.Reader p_193841_1_, java.lang.reflect.Type p_193841_2_)`
- `static<T> T fromJson(Gson p_193838_0_, java.io.Reader p_193838_1_, java.lang.reflect.Type p_193838_2_, boolean p_193838_3_)`
- `static<T> T fromJson(Gson p_193837_0_, java.lang.String p_193837_1_, java.lang.reflect.Type p_193837_2_, boolean p_193837_3_)`
- `static boolean getBoolean(JsonElement json, java.lang.String memberName)`
- `static boolean getBoolean(JsonObject json, java.lang.String memberName)`
- `static boolean getBoolean(JsonObject json, java.lang.String memberName, boolean fallback)`
- `static float getFloat(JsonElement json, java.lang.String memberName)`
- `static float getFloat(JsonObject json, java.lang.String memberName)`
- `static float getFloat(JsonObject json, java.lang.String memberName, float fallback)`
- `static int getInt(JsonElement json, java.lang.String memberName)`
- `static int getInt(JsonObject json, java.lang.String memberName)`
- `static int getInt(JsonObject json, java.lang.String memberName, int fallback)`
- `static Item getItem(JsonElement json, java.lang.String memberName)`
- `static Item getItem(JsonObject json, java.lang.String memberName)`
- `static JsonArray getJsonArray(JsonElement json, java.lang.String memberName)`
- `static JsonArray getJsonArray(JsonObject json, java.lang.String memberName)`
- `static JsonArray getJsonArray(JsonObject json, java.lang.String memberName, JsonArray fallback)`
- `static JsonObject getJsonObject(JsonElement json, java.lang.String memberName)`
- `static JsonObject getJsonObject(JsonObject json, java.lang.String memberName)`
- `static JsonObject getJsonObject(JsonObject json, java.lang.String memberName, JsonObject fallback)`
- `static java.lang.String getString(JsonElement json, java.lang.String memberName)`
- `static java.lang.String getString(JsonObject json, java.lang.String memberName)`
- `static java.lang.String getString(JsonObject json, java.lang.String memberName, java.lang.String fallback)`
- `static<T> T gsonDeserialize(Gson gsonIn, java.io.Reader readerIn, java.lang.Class<T> adapter, boolean lenient)`
- `static<T> T gsonDeserialize(Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter)`
- `static<T> T gsonDeserialize(Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter, boolean lenient)`
- `static<T> T gsonDeserialize(Gson p_193840_0_, java.lang.String p_193840_1_, java.lang.reflect.Type p_193840_2_)`
- `static boolean hasField(JsonObject json, java.lang.String memberName)`
- `static boolean isBoolean(JsonObject json, java.lang.String memberName)`
- `static boolean isJsonArray(JsonObject json, java.lang.String memberName)`
- `static boolean isJsonPrimitive(JsonObject json, java.lang.String memberName)`
- `static boolean isNumber(JsonElement json)`
- `static boolean isString(JsonElement json)`
- `static boolean isString(JsonObject json, java.lang.String memberName)`
- `static java.lang.String toString(JsonElement json)`
