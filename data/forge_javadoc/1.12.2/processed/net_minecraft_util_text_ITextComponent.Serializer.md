# ITextComponent.Serializer

**Inheritance:** java.lang.Object → net.minecraft.util.text.ITextComponent.Serializer

## Class signature

```java
public static class ITextComponent.Serializer extends java.lang.Object
```

## Constructors

- `Serializer()`

## Methods

- `static java.lang.String componentToJson(ITextComponent component)`
- `ITextComponent deserialize(JsonElement p_deserialize_1_, java.lang.reflect.Type p_deserialize_2_, JsonDeserializationContext p_deserialize_3_)`
- `static ITextComponent fromJsonLenient(java.lang.String json)`
- `static ITextComponent jsonToComponent(java.lang.String json)`
- `JsonElement serialize(ITextComponent p_serialize_1_, java.lang.reflect.Type p_serialize_2_, JsonSerializationContext p_serialize_3_)`