# LootFunction.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getFunctionName()`
- `public java.lang.Class< T > getFunctionClass()`
- `public abstract void serialize(com.google.gson.JsonObject object, T functionClazz, com.google.gson.JsonSerializationContext serializationContext)`
- `public abstract T deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, LootCondition [] conditionsIn)`