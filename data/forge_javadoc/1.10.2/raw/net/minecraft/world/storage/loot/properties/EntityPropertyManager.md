---
title: "EntityPropertyManager"
description: "public class EntityPropertyManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/properties"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/world/storage/loot/properties/EntityPropertyManager.html"
sourceType: javadoc
---

# EntityPropertyManager

**Inheritance:** java.lang.Object → net.minecraft.world.storage.loot.properties.EntityPropertyManager

## Class signature

```java
public class EntityPropertyManager extends java.lang.Object
```

## Constructors

- `EntityPropertyManager()`

## Methods

- `static<T extends EntityProperty> EntityProperty.Serializer<T> getSerializerFor(T property)`
- `static EntityProperty.Serializer<?> getSerializerForName(ResourceLocation p_186646_0_)`
- `static<T extends EntityProperty> void registerProperty(EntityProperty.Serializer<? extends T> p_186644_0_)`
