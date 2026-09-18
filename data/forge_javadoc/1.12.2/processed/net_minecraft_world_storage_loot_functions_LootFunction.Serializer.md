# LootFunction.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getFunctionName()`
- `public java.lang.Class< T > getFunctionClass()`
- `public abstract void serialize(JsonObject object, T functionClazz, JsonSerializationContext serializationContext)`
- `public abstract T deserialize(JsonObject object, JsonDeserializationContext deserializationContext, LootCondition [] conditionsIn)`