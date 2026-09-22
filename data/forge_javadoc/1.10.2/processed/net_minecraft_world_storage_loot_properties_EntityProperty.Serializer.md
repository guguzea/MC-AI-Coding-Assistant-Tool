# EntityProperty.Serializer

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.properties.EntityProperty.Serializer<T>

## Class signature

```java
public abstract static class EntityProperty.Serializer<T extends EntityProperty> extends java.lang.Object
```

## Constructors

- `Serializer(ResourceLocation nameIn, java.lang.Class<T> propertyClassIn)`

## Methods

- `abstract T deserialize(com.google.gson.JsonElement element, com.google.gson.JsonDeserializationContext deserializationContext)`
- `ResourceLocation getName()`
- `java.lang.Class<T> getPropertyClass()`
- `abstract com.google.gson.JsonElement serialize(T property, com.google.gson.JsonSerializationContext serializationContext)`