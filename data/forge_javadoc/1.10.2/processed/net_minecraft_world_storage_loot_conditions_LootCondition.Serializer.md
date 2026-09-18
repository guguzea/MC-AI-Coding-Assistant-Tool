# LootCondition.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getLootTableLocation()`
- `public java.lang.Class< T > getConditionClass()`
- `public abstract void serialize(com.google.gson.JsonObject json, T value, com.google.gson.JsonSerializationContext context)`
- `public abstract T deserialize(com.google.gson.JsonObject json, com.google.gson.JsonDeserializationContext context)`