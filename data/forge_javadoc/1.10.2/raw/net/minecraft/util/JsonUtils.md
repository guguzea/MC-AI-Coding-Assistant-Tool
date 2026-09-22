---
title: "JsonUtils"
description: "public class JsonUtils extends java.lang.Object"
package: "net/minecraft/util"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/util/JsonUtils.html"
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

- `static<T> T deserializeClass(com.google.gson.JsonElement json, java.lang.String memberName, com.google.gson.JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `static<T> T deserializeClass(com.google.gson.JsonObject json, java.lang.String memberName, com.google.gson.JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `static<T> T deserializeClass(com.google.gson.JsonObject json, java.lang.String memberName, T fallback, com.google.gson.JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `static boolean getBoolean(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static boolean getBoolean(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static boolean getBoolean(com.google.gson.JsonObject json, java.lang.String memberName, boolean fallback)`
- `static float getFloat(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static float getFloat(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static float getFloat(com.google.gson.JsonObject json, java.lang.String memberName, float fallback)`
- `static int getInt(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static int getInt(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static int getInt(com.google.gson.JsonObject json, java.lang.String memberName, int fallback)`
- `static Item getItem(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static Item getItem(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static com.google.gson.JsonArray getJsonArray(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static com.google.gson.JsonArray getJsonArray(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static com.google.gson.JsonArray getJsonArray(com.google.gson.JsonObject json, java.lang.String memberName, com.google.gson.JsonArray fallback)`
- `static com.google.gson.JsonObject getJsonObject(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static com.google.gson.JsonObject getJsonObject(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static com.google.gson.JsonObject getJsonObject(com.google.gson.JsonObject json, java.lang.String memberName, com.google.gson.JsonObject fallback)`
- `static java.lang.String getString(com.google.gson.JsonElement json, java.lang.String memberName)`
- `static java.lang.String getString(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static java.lang.String getString(com.google.gson.JsonObject json, java.lang.String memberName, java.lang.String fallback)`
- `static<T> T gsonDeserialize(com.google.gson.Gson gsonIn, java.io.Reader readerIn, java.lang.Class<T> adapter, boolean lenient)`
- `static<T> T gsonDeserialize(com.google.gson.Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter)`
- `static<T> T gsonDeserialize(com.google.gson.Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter, boolean lenient)`
- `static boolean hasField(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static boolean isBoolean(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static boolean isJsonArray(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static boolean isJsonPrimitive(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static boolean isNumber(com.google.gson.JsonElement json)`
- `static boolean isString(com.google.gson.JsonElement json)`
- `static boolean isString(com.google.gson.JsonObject json, java.lang.String memberName)`
- `static java.lang.String toString(com.google.gson.JsonElement json)`
