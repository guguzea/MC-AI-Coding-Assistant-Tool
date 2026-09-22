---
title: "LootCondition.Serializer"
description: "public abstract static class LootCondition.Serializer<T extends LootCondition> extends java.lang.Object"
package: "net/minecraft/world/storage/loot/conditions"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/conditions/LootCondition.Serializer.html"
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

- `abstract T deserialize(com.google.gson.JsonObject json, com.google.gson.JsonDeserializationContext context)`
- `java.lang.Class<T> getConditionClass()`
- `ResourceLocation getLootTableLocation()`
- `abstract void serialize(com.google.gson.JsonObject json, T value, com.google.gson.JsonSerializationContext context)`
