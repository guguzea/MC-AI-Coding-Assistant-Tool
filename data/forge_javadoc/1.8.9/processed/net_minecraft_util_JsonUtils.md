# JsonUtils

**Inheritance:** java.lang.Object → net.minecraft.util.JsonUtils

## Class signature

```java
public class JsonUtils extends java.lang.Object
```

## Constructors

- `JsonUtils()`

## Methods

- `static boolean getBoolean(JsonElement p_151216_0_, java.lang.String p_151216_1_)` — Gets the boolean value of the given JsonElement.
- `static boolean getBoolean(JsonObject p_151212_0_, java.lang.String p_151212_1_)` — Gets the boolean value of the field on the JsonObject with the given name.
- `static boolean getBoolean(JsonObject p_151209_0_, java.lang.String p_151209_1_, boolean p_151209_2_)` — Gets the boolean value of the field on the JsonObject with the given name, or the given default value if the field is missing.
- `static float getFloat(JsonElement p_151220_0_, java.lang.String p_151220_1_)` — Gets the float value of the given JsonElement.
- `static float getFloat(JsonObject p_151217_0_, java.lang.String p_151217_1_)` — Gets the float value of the field on the JsonObject with the given name.
- `static float getFloat(JsonObject p_151221_0_, java.lang.String p_151221_1_, float p_151221_2_)` — Gets the float value of the field on the JsonObject with the given name, or the given default value if the field is missing.
- `static int getInt(JsonElement p_151215_0_, java.lang.String p_151215_1_)` — Gets the integer value of the given JsonElement.
- `static int getInt(JsonObject p_151203_0_, java.lang.String p_151203_1_)` — Gets the integer value of the field on the JsonObject with the given name.
- `static int getInt(JsonObject p_151208_0_, java.lang.String p_151208_1_, int p_151208_2_)` — Gets the integer value of the field on the JsonObject with the given name, or the given default value if the field is missing.
- `static JsonArray getJsonArray(JsonElement p_151207_0_, java.lang.String p_151207_1_)` — Gets the given JsonElement as a JsonArray.
- `static JsonArray getJsonArray(JsonObject p_151214_0_, java.lang.String p_151214_1_)` — Gets the JsonArray field on the JsonObject with the given name.
- `static JsonArray getJsonArray(JsonObject p_151213_0_, java.lang.String p_151213_1_, JsonArray p_151213_2_)` — Gets the JsonArray field on the JsonObject with the given name, or the given default value if the field is missing.
- `static JsonObject getJsonObject(JsonElement p_151210_0_, java.lang.String p_151210_1_)` — Gets the given JsonElement as a JsonObject.
- `static JsonObject getJsonObject(JsonObject base, java.lang.String key)`
- `static JsonObject getJsonObject(JsonObject p_151218_0_, java.lang.String p_151218_1_, JsonObject p_151218_2_)` — Gets the JsonObject field on the JsonObject with the given name, or the given default value if the field is missing.
- `static java.lang.String getString(JsonElement p_151206_0_, java.lang.String p_151206_1_)` — Gets the string value of the given JsonElement.
- `static java.lang.String getString(JsonObject p_151200_0_, java.lang.String p_151200_1_)` — Gets the string value of the field on the JsonObject with the given name.
- `static java.lang.String getString(JsonObject p_151219_0_, java.lang.String p_151219_1_, java.lang.String p_151219_2_)` — Gets the string value of the field on the JsonObject with the given name, or the given default value if the field is missing.
- `static boolean hasField(JsonObject p_151204_0_, java.lang.String p_151204_1_)` — Does the given JsonObject contain a field with the given name?
- `static boolean isBoolean(JsonObject p_180199_0_, java.lang.String p_180199_1_)`
- `static boolean isJsonArray(JsonObject p_151202_0_, java.lang.String p_151202_1_)` — Does the given JsonObject contain an array field with the given name?
- `static boolean isJsonPrimitive(JsonObject p_151201_0_, java.lang.String p_151201_1_)` — Does the given JsonObject contain a field with the given name whose type is primitive (String, Java primitive, or Java primitive wrapper)?
- `static boolean isString(JsonElement p_151211_0_)` — Is the given JsonElement a string?
- `static boolean isString(JsonObject p_151205_0_, java.lang.String p_151205_1_)` — Does the given JsonObject contain a string field with the given name?
- `static java.lang.String toString(JsonElement p_151222_0_)` — Gets a human-readable description of the given JsonElement's type.