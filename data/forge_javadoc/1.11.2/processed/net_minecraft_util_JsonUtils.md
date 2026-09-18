# JsonUtils

## Class signature

```java
public class JsonUtils extends java.lang.Object
```

## Constructors

- `public JsonUtils()`

## Methods

- `public static boolean isString(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static boolean isString(com.google.gson.JsonElement json)`
- `public static boolean isNumber(com.google.gson.JsonElement json)`
- `public static boolean isBoolean(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static boolean isJsonArray(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static boolean isJsonPrimitive(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static boolean hasField(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static java.lang.String getString(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static java.lang.String getString(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static java.lang.String getString(com.google.gson.JsonObject json, java.lang.String memberName, java.lang.String fallback)`
- `public static Item getItem(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static Item getItem(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static boolean getBoolean(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static boolean getBoolean(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static boolean getBoolean(com.google.gson.JsonObject json, java.lang.String memberName, boolean fallback)`
- `public static float getFloat(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static float getFloat(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static float getFloat(com.google.gson.JsonObject json, java.lang.String memberName, float fallback)`
- `public static int getInt(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static int getInt(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static int getInt(com.google.gson.JsonObject json, java.lang.String memberName, int fallback)`
- `public static com.google.gson.JsonObject getJsonObject(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static com.google.gson.JsonObject getJsonObject(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static com.google.gson.JsonObject getJsonObject(com.google.gson.JsonObject json, java.lang.String memberName, com.google.gson.JsonObject fallback)`
- `public static com.google.gson.JsonArray getJsonArray(com.google.gson.JsonElement json, java.lang.String memberName)`
- `public static com.google.gson.JsonArray getJsonArray(com.google.gson.JsonObject json, java.lang.String memberName)`
- `public static com.google.gson.JsonArray getJsonArray(com.google.gson.JsonObject json, java.lang.String memberName, @Nullable com.google.gson.JsonArray fallback)`
- `public static <T> T deserializeClass(@Nullable com.google.gson.JsonElement json, java.lang.String memberName, com.google.gson.JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `public static <T> T deserializeClass(com.google.gson.JsonObject json, java.lang.String memberName, com.google.gson.JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `public static <T> T deserializeClass(com.google.gson.JsonObject json, java.lang.String memberName, T fallback, com.google.gson.JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `public static java.lang.String toString(com.google.gson.JsonElement json)`
- `public static <T> T gsonDeserialize(com.google.gson.Gson gsonIn, java.io.Reader readerIn, java.lang.Class<T> adapter, boolean lenient)`
- `public static <T> T gsonDeserialize(com.google.gson.Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter)`
- `public static <T> T gsonDeserialize(com.google.gson.Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter, boolean lenient)`