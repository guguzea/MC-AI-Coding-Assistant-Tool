# RegistryDelegate.Delegate

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.registry.RegistryDelegate.Delegate<T>

## Class signature

```java
public static final class RegistryDelegate.Delegate<T> extends java.lang.Object implements RegistryDelegate<T>
```

## Constructors

- `Delegate(T referant, java.lang.Class<T> type)`

## Methods

- `boolean equals(java.lang.Object obj)`
- `T get()` — Get the referent pointed at by this delegate.
- `ResourceLocation getResourceName()` — Get the unique resource location for this delegate.
- `int hashCode()`
- `java.lang.String name()` — Get the name of this delegate.
- `java.lang.Class<T> type()` — Get the delegate type.