---
title: "LootFunction.Serializer"
description: "public abstract static class LootFunction.Serializer<T extends LootFunction> extends java.lang.Object"
package: "net/minecraft/world/storage/loot/functions"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/functions/LootFunction.Serializer.html"
sourceType: javadoc
---

# LootFunction.Serializer

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.functions.LootFunction.Serializer<T>

## Class signature

```java
public abstract static class LootFunction.Serializer<T extends LootFunction> extends java.lang.Object
```

## Constructors

- `Serializer(ResourceLocation location, java.lang.Class<T> clazz)`

## Methods

- `abstract T deserialize(com.google.gson.JsonObject object, com.google.gson.JsonDeserializationContext deserializationContext, LootCondition [] conditionsIn)`
- `java.lang.Class<T> getFunctionClass()`
- `ResourceLocation getFunctionName()`
- `abstract void serialize(com.google.gson.JsonObject object, T functionClazz, com.google.gson.JsonSerializationContext serializationContext)`
