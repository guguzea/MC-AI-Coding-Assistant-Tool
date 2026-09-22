# ReflectionHelper

**Inheritance:** java.lang.Object → cpw.mods.fml.relauncher.ReflectionHelper

## Class signature

```java
public class ReflectionHelper extends java.lang.Object
```

## Constructors

- `ReflectionHelper()`

## Methods

- `static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String... fieldNames)`
- `static<E> java.lang.reflect.Method findMethod(java.lang.Class<? super E> clazz, E instance, java.lang.String[] methodNames, java.lang.Class<?>... methodTypes)`
- `static java.lang.Class<? super java.lang.Object> getClass(java.lang.ClassLoader loader, java.lang.String... classNames)`
- `static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)`
- `static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)`