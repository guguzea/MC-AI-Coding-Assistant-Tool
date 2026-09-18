# RegistryDelegate

## Class signature

```java
public interface RegistryDelegate<T>
```

## Methods

- `T get()`
- `java.lang.String name()`
- `java.lang.Class< T > type()`

## Description

A registry delegate for holding references to items or blocks These should be safe to use in things like lists though aliased items and blocks will not have object identity with respect to their deleg