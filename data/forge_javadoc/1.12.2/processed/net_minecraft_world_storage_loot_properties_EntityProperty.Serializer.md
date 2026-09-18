# EntityProperty.Serializer

## Constructors

- `protected Serializer( ResourceLocation nameIn, java.lang.Class< T > propertyClassIn)`

## Methods

- `public ResourceLocation getName()`
- `public java.lang.Class< T > getPropertyClass()`
- `public abstract JsonElement serialize( T property, JsonSerializationContext serializationContext)`
- `public abstract T deserialize(JsonElement element, JsonDeserializationContext deserializationContext)`