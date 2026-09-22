---
title: "EntityPropertyManager"
description: "public class EntityPropertyManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/properties"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/world/storage/loot/properties/EntityPropertyManager.html"
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
- `static EntityProperty.Serializer<?> getSerializerForName(ResourceLocation name)`
- `static<T extends EntityProperty> void registerProperty(EntityProperty.Serializer<? extends T> serializer)`
