# LootFunction.Serializer

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.functions.LootFunction.Serializer<T>

## Class signature

```java
public abstract static class LootFunction.Serializer<T extends LootFunction> extends java.lang.Object
```

## Constructors

- `Serializer(ResourceLocation location, java.lang.Class<T> clazz)`

## Methods

- `abstract T deserialize(JsonObject object, JsonDeserializationContext deserializationContext, LootCondition [] conditionsIn)`
- `java.lang.Class<T> getFunctionClass()`
- `ResourceLocation getFunctionName()`
- `abstract void serialize(JsonObject object, T functionClazz, JsonSerializationContext serializationContext)`