# JsonUtils

## Class signature

```java
public class JsonUtils extends java.lang.Object
```

## Constructors

- `public JsonUtils()`

## Methods

- `public static boolean isString(JsonObject json, java.lang.String memberName)`
- `public static boolean isString(JsonElement json)`
- `public static boolean isNumber(JsonElement json)`
- `public static boolean isBoolean(JsonObject json, java.lang.String memberName)`
- `public static boolean isJsonArray(JsonObject json, java.lang.String memberName)`
- `public static boolean isJsonPrimitive(JsonObject json, java.lang.String memberName)`
- `public static boolean hasField(JsonObject json, java.lang.String memberName)`
- `public static java.lang.String getString(JsonElement json, java.lang.String memberName)`
- `public static java.lang.String getString(JsonObject json, java.lang.String memberName)`
- `public static java.lang.String getString(JsonObject json, java.lang.String memberName, java.lang.String fallback)`
- `public static Item getItem(JsonElement json, java.lang.String memberName)`
- `public static Item getItem(JsonObject json, java.lang.String memberName)`
- `public static boolean getBoolean(JsonElement json, java.lang.String memberName)`
- `public static boolean getBoolean(JsonObject json, java.lang.String memberName)`
- `public static boolean getBoolean(JsonObject json, java.lang.String memberName, boolean fallback)`
- `public static float getFloat(JsonElement json, java.lang.String memberName)`
- `public static float getFloat(JsonObject json, java.lang.String memberName)`
- `public static float getFloat(JsonObject json, java.lang.String memberName, float fallback)`
- `public static int getInt(JsonElement json, java.lang.String memberName)`
- `public static int getInt(JsonObject json, java.lang.String memberName)`
- `public static int getInt(JsonObject json, java.lang.String memberName, int fallback)`
- `public static JsonObject getJsonObject(JsonElement json, java.lang.String memberName)`
- `public static JsonObject getJsonObject(JsonObject json, java.lang.String memberName)`
- `public static JsonObject getJsonObject(JsonObject json, java.lang.String memberName, JsonObject fallback)`
- `public static JsonArray getJsonArray(JsonElement json, java.lang.String memberName)`
- `public static JsonArray getJsonArray(JsonObject json, java.lang.String memberName)`
- `public static JsonArray getJsonArray(JsonObject json, java.lang.String memberName, JsonArray fallback)`
- `public static <T> T deserializeClass(JsonElement json, java.lang.String memberName, JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `public static <T> T deserializeClass(JsonObject json, java.lang.String memberName, JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `public static <T> T deserializeClass(JsonObject json, java.lang.String memberName, T fallback, JsonDeserializationContext context, java.lang.Class<? extends T> adapter)`
- `public static java.lang.String toString(JsonElement json)`
- `public static <T> T gsonDeserialize(Gson gsonIn, java.io.Reader readerIn, java.lang.Class<T> adapter, boolean lenient)`
- `public static <T> T fromJson(Gson p_193838_0_, java.io.Reader p_193838_1_, java.lang.reflect.Type p_193838_2_, boolean p_193838_3_)`
- `public static <T> T fromJson(Gson p_193837_0_, java.lang.String p_193837_1_, java.lang.reflect.Type p_193837_2_, boolean p_193837_3_)`
- `public static <T> T gsonDeserialize(Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter, boolean lenient)`
- `public static <T> T fromJson(Gson p_193841_0_, java.io.Reader p_193841_1_, java.lang.reflect.Type p_193841_2_)`
- `public static <T> T gsonDeserialize(Gson p_193840_0_, java.lang.String p_193840_1_, java.lang.reflect.Type p_193840_2_)`
- `public static <T> T fromJson(Gson p_193839_0_, java.io.Reader p_193839_1_, java.lang.Class<T> p_193839_2_)`
- `public static <T> T gsonDeserialize(Gson gsonIn, java.lang.String json, java.lang.Class<T> adapter)`