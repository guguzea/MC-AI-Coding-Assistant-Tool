# LootCondition.Serializer

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.conditions.LootCondition.Serializer<T>

## Class signature

```java
public abstract static class LootCondition.Serializer<T extends LootCondition> extends java.lang.Object
```

## Constructors

- `Serializer(ResourceLocation location, java.lang.Class<T> clazz)`

## Methods

- `abstract T deserialize(JsonObject json, JsonDeserializationContext context)`
- `java.lang.Class<T> getConditionClass()`
- `ResourceLocation getLootTableLocation()`
- `abstract void serialize(JsonObject json, T value, JsonSerializationContext context)`