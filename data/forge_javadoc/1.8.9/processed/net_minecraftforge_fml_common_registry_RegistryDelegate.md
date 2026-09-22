# RegistryDelegate

## Class signature

```java
public interface RegistryDelegate<T>
```

## Methods

- `T get()` — Get the referent pointed at by this delegate.
- `ResourceLocation getResourceName()` — Get the unique resource location for this delegate.
- `@Deprecated java.lang.String name()`
- `java.lang.Class<T> type()` — Get the delegate type.