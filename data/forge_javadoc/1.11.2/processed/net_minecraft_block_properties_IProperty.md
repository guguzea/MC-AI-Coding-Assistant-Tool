# IProperty

## Class signature

```java
public interface IProperty<T extends java.lang.Comparable<T>>
```

## Methods

- `java.util.Collection<T> getAllowedValues()`
- `java.lang.String getName()`
- `java.lang.String getName(T value)`
- `java.lang.Class<T> getValueClass()`
- `com.google.common.base.Optional<T> parseValue(java.lang.String value)`