---
title: "PropertyEnum"
description: "public class PropertyEnum<T extends java.lang.Enum<T> & IStringSerializable > extends PropertyHelper <T>"
package: "net/minecraft/block/properties"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/block/properties/PropertyEnum.html"
sourceType: javadoc
---

# PropertyEnum

## Class signature

```java
public class PropertyEnum<T extends java.lang.Enum<T> & IStringSerializable > extends PropertyHelper <T>
```

## Constructors

- `protected PropertyEnum(java.lang.String name, java.lang.Class< T > valueClass, java.util.Collection< T > allowedValues)`

## Methods

- `public java.util.Collection< T > getAllowedValues()`
- `public <any> parseValue(java.lang.String value)`
- `public java.lang.String getName( T value)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, <any> filter)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, T... values)`
