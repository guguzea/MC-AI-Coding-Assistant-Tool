# ObfuscationReflectionHelper

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.ObfuscationReflectionHelper

## Class signature

```java
public class ObfuscationReflectionHelper extends java.lang.Object
```

## Constructors

- `ObfuscationReflectionHelper()`

## Methods

- `static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)`
- `static java.lang.String[] remapFieldNames(java.lang.String className, java.lang.String... fieldNames)`
- `static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)`