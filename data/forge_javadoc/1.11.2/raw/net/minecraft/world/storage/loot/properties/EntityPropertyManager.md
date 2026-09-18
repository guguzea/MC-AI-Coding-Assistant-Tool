---
title: "EntityPropertyManager"
description: "public class EntityPropertyManager extends java.lang.Object"
package: "net/minecraft/world/storage/loot/properties"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/storage/loot/properties/EntityPropertyManager.html"
sourceType: javadoc
---

# EntityPropertyManager

## Class signature

```java
public class EntityPropertyManager extends java.lang.Object
```

## Constructors

- `public EntityPropertyManager()`

## Methods

- `public static <T extends EntityProperty > void registerProperty( EntityProperty.Serializer <? extends T> p_186644_0_)`
- `public static EntityProperty.Serializer <?> getSerializerForName( ResourceLocation p_186646_0_)`
- `public static <T extends EntityProperty > EntityProperty.Serializer <T> getSerializerFor(T property)`
