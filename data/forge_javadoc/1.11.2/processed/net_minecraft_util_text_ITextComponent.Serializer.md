# ITextComponent.Serializer

**Inheritance:** java.lang.Object → net.minecraft.util.text.ITextComponent.Serializer

## Class signature

```java
public static class ITextComponent.Serializer extends java.lang.Object implements com.google.gson.JsonDeserializer<ITextComponent>, com.google.gson.JsonSerializer<ITextComponent>
```

## Constructors

- `Serializer()`

## Methods

- `static java.lang.String componentToJson(ITextComponent component)`
- `ITextComponent deserialize(com.google.gson.JsonElement p_deserialize_1_, java.lang.reflect.Type p_deserialize_2_, com.google.gson.JsonDeserializationContext p_deserialize_3_)`
- `static ITextComponent fromJsonLenient(java.lang.String json)`
- `static ITextComponent jsonToComponent(java.lang.String json)`
- `com.google.gson.JsonElement serialize(ITextComponent p_serialize_1_, java.lang.reflect.Type p_serialize_2_, com.google.gson.JsonSerializationContext p_serialize_3_)`