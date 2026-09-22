---
title: "PropertyEnum"
description: "public class PropertyEnum<T extends java.lang.Enum<T>& IStringSerializable> extends PropertyHelper<T>"
package: "net/minecraft/block/properties"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/properties/PropertyEnum.html"
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
- `boolean equals(java.lang.Object p_equals_1_)`
- `java.util.Collection<T> getAllowedValues()`
- `java.lang.String getName(T value)`
- `int hashCode()`
- `<any> parseValue(java.lang.String value)`
