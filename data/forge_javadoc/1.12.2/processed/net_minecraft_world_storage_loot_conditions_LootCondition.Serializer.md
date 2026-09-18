# LootCondition.Serializer

## Constructors

- `protected Serializer( ResourceLocation location, java.lang.Class< T > clazz)`

## Methods

- `public ResourceLocation getLootTableLocation()`
- `public java.lang.Class< T > getConditionClass()`
- `public abstract void serialize(JsonObject json, T value, JsonSerializationContext context)`
- `public abstract T deserialize(JsonObject json, JsonDeserializationContext context)`