# EntityProperty.Serializer

## Constructors

- `protected Serializer( ResourceLocation nameIn, java.lang.Class< T > propertyClassIn)`

## Methods

- `public ResourceLocation getName()`
- `public java.lang.Class< T > getPropertyClass()`
- `public abstract com.google.gson.JsonElement serialize( T property, com.google.gson.JsonSerializationContext serializationContext)`
- `public abstract T deserialize(com.google.gson.JsonElement element, com.google.gson.JsonDeserializationContext deserializationContext)`