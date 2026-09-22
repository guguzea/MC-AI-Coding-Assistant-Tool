---
title: "PropertyEnum"
description: "public class PropertyEnum<T extends java.lang.Enum<T>& IStringSerializable> extends PropertyHelper<T>"
package: "net/minecraft/block/properties"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/block/properties/PropertyEnum.html"
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
- `static<T extends java.lang.Enum<T>& IStringSerializable> PropertyEnum<T> create(java.lang.String name, java.lang.Class<T> clazz, java.util.Collection<T> values)`
- `static<T extends java.lang.Enum<T>& IStringSerializable> PropertyEnum<T> create(java.lang.String name, java.lang.Class<T> clazz, com.google.common.base.Predicate<T> filter)`
- `static<T extends java.lang.Enum<T>& IStringSerializable> PropertyEnum<T> create(java.lang.String name, java.lang.Class<T> clazz, T... values)`
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.util.Collection<T> getAllowedValues()`
- `java.lang.String getName(T value)`
- `int hashCode()`
- `com.google.common.base.Optional<T> parseValue(java.lang.String value)`
