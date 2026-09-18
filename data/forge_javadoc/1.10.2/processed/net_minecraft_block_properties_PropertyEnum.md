# PropertyEnum

## Class signature

```java
public class PropertyEnum<T extends java.lang.Enum<T> & IStringSerializable > extends PropertyHelper <T>
```

## Constructors

- `protected PropertyEnum(java.lang.String name, java.lang.Class< T > valueClass, java.util.Collection< T > allowedValues)`

## Methods

- `public java.util.Collection< T > getAllowedValues()`
- `public com.google.common.base.Optional< T > parseValue(java.lang.String value)`
- `public java.lang.String getName( T value)`
- `public boolean equals(java.lang.Object p_equals_1_)`
- `public int hashCode()`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, com.google.common.base.Predicate<T> filter)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, T... values)`
- `public static <T extends java.lang.Enum<T> & IStringSerializable > PropertyEnum <T> create(java.lang.String name, java.lang.Class<T> clazz, java.util.Collection<T> values)`