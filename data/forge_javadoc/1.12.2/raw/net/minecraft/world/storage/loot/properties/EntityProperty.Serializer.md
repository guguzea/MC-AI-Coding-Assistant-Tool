---
title: "EntityProperty.Serializer"
description: "public abstract static class EntityProperty.Serializer<T extends EntityProperty> extends java.lang.Object"
package: "net/minecraft/world/storage/loot/properties"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/properties/EntityProperty.Serializer.html"
sourceType: javadoc
---

# EntityProperty.Serializer

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.properties.EntityProperty.Serializer<T>

## Class signature

```java
public abstract static class EntityProperty.Serializer<T extends EntityProperty> extends java.lang.Object
```

## Constructors

- `Serializer(ResourceLocation nameIn, java.lang.Class<T> propertyClassIn)`

## Methods

- `abstract T deserialize(JsonElement element, JsonDeserializationContext deserializationContext)`
- `ResourceLocation getName()`
- `java.lang.Class<T> getPropertyClass()`
- `abstract JsonElement serialize(T property, JsonSerializationContext serializationContext)`
