# PropertyEnum

## Class signature

```java
public class PropertyEnum<T extends java.lang.Enum<T> & IStringSerializable > extends PropertyHelper <T>
```

## Constructors

- `protected PropertyEnum(java.lang.String name, java.lang.Class< T > valueClass, java.util.Collection< T > allowedValues)`

## Methods

- `public java.util.Collection< T > getAllowedValues()`
- `public java.lang.String getName( T value)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, <any> filter)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, T... values)`

## Description

Get the name for the given value.