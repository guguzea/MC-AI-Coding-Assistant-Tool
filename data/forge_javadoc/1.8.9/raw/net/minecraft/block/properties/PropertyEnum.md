---
title: "PropertyEnum"
description: "public class PropertyEnum<T extends java.lang.Enum<T>& IStringSerializable> extends PropertyHelper<T>"
package: "net/minecraft/block/properties"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/block/properties/PropertyEnum.html"
sourceType: javadoc
---

# PropertyEnum

**Inheritance:** java.lang.Object → net.minecraft.block.properties.PropertyHelper<T> → net.minecraft.block.properties.PropertyEnum<T>

## Class signature

```java
public class PropertyEnum<T extends java.lang.Enum<T>& IStringSerializable> extends PropertyHelper<T>
```

## Constructors

- `PropertyEnum(java.lang.String name, java.lang.Class<T> valueClass, java.util.Collection<T> allowedValues)`

## Methods

- `static<T extends java.lang.Enum<T>& IStringSerializable> PropertyEnum<T> create(java.lang.String name, java.lang.Class<T> clazz)`
- `static<T extends java.lang.Enum<T>& IStringSerializable> PropertyEnum<T> create(java.lang.String name, java.lang.Class<T> clazz, <any> filter)`
- `static<T extends java.lang.Enum<T>& IStringSerializable> PropertyEnum<T> create(java.lang.String name, java.lang.Class<T> clazz, T... values)`
- `java.util.Collection<T> getAllowedValues()`
- `java.lang.String getName(T value)` — Get the name for the given value.
