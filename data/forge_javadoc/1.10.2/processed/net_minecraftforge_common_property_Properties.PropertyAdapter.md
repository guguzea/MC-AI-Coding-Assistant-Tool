# Properties.PropertyAdapter

**Inheritance:** java.lang.Object → net.minecraftforge.common.property.Properties.PropertyAdapter<V>

## Class signature

```java
public static class Properties.PropertyAdapter<V extends java.lang.Comparable<V>> extends java.lang.Object implements IUnlistedProperty<V>
```

## Constructors

- `PropertyAdapter(IProperty<V> parent)`

## Methods

- `java.lang.String getName()`
- `java.lang.Class<V> getType()`
- `boolean isValid(V value)`
- `java.lang.String valueToString(V value)`