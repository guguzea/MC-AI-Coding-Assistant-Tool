---
title: "LootCondition.Serializer"
description: "public abstract static class LootCondition.Serializer<T extends LootCondition> extends java.lang.Object"
package: "net/minecraft/world/storage/loot/conditions"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/conditions/LootCondition.Serializer.html"
sourceType: javadoc
---

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
