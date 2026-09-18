# JsonUtils

## Class signature

```java
public class JsonUtils extends java.lang.Object
```

## Constructors

- `public JsonUtils()`

## Methods

- `public static boolean isString(JsonObject p_151205_0_, java.lang.String p_151205_1_)`
- `public static boolean isString(JsonElement p_151211_0_)`
- `public static boolean isBoolean(JsonObject p_180199_0_, java.lang.String p_180199_1_)`
- `public static boolean isJsonArray(JsonObject p_151202_0_, java.lang.String p_151202_1_)`
- `public static boolean isJsonPrimitive(JsonObject p_151201_0_, java.lang.String p_151201_1_)`
- `public static boolean hasField(JsonObject p_151204_0_, java.lang.String p_151204_1_)`
- `public static java.lang.String getString(JsonElement p_151206_0_, java.lang.String p_151206_1_)`
- `public static java.lang.String getString(JsonObject p_151200_0_, java.lang.String p_151200_1_)`
- `public static java.lang.String getString(JsonObject p_151219_0_, java.lang.String p_151219_1_, java.lang.String p_151219_2_)`
- `public static boolean getBoolean(JsonElement p_151216_0_, java.lang.String p_151216_1_)`
- `public static boolean getBoolean(JsonObject p_151212_0_, java.lang.String p_151212_1_)`
- `public static boolean getBoolean(JsonObject p_151209_0_, java.lang.String p_151209_1_, boolean p_151209_2_)`
- `public static float getFloat(JsonElement p_151220_0_, java.lang.String p_151220_1_)`
- `public static float getFloat(JsonObject p_151217_0_, java.lang.String p_151217_1_)`
- `public static float getFloat(JsonObject p_151221_0_, java.lang.String p_151221_1_, float p_151221_2_)`
- `public static int getInt(JsonElement p_151215_0_, java.lang.String p_151215_1_)`
- `public static int getInt(JsonObject p_151203_0_, java.lang.String p_151203_1_)`
- `public static int getInt(JsonObject p_151208_0_, java.lang.String p_151208_1_, int p_151208_2_)`
- `public static JsonObject getJsonObject(JsonElement p_151210_0_, java.lang.String p_151210_1_)`
- `public static JsonObject getJsonObject(JsonObject base, java.lang.String key)`
- `public static JsonObject getJsonObject(JsonObject p_151218_0_, java.lang.String p_151218_1_, JsonObject p_151218_2_)`
- `public static JsonArray getJsonArray(JsonElement p_151207_0_, java.lang.String p_151207_1_)`
- `public static JsonArray getJsonArray(JsonObject p_151214_0_, java.lang.String p_151214_1_)`
- `public static JsonArray getJsonArray(JsonObject p_151213_0_, java.lang.String p_151213_1_, JsonArray p_151213_2_)`
- `public static java.lang.String toString(JsonElement p_151222_0_)`

## Description

Gets the boolean value of the given JsonElement.