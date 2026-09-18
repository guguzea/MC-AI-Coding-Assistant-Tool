# IProperty

## Class signature

```java
public interface IProperty<T extends java.lang.Comparable<T>>
```

## Methods

- `java.lang.String getName()`
- `java.util.Collection< T > getAllowedValues()`
- `java.lang.Class< T > getValueClass()`
- `com.google.common.base.Optional< T > parseValue(java.lang.String value)`
- `java.lang.String getName( T value)`