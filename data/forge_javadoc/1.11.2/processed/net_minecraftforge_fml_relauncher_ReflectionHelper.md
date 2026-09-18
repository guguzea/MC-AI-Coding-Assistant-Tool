# ReflectionHelper

## Class signature

```java
public class ReflectionHelper extends java.lang.Object
```

## Constructors

- `public ReflectionHelper()`

## Methods

- `public static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String... fieldNames)`
- `public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, @Nullable E instance, int fieldIndex)`
- `public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)`
- `public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)`
- `public static java.lang.Class<? super java.lang.Object> getClass(java.lang.ClassLoader loader, java.lang.String... classNames)`
- `public static <E> java.lang.reflect.Method findMethod(java.lang.Class<? super E> clazz, E instance, java.lang.String[] methodNames, java.lang.Class<?>... methodTypes)`

## Description

Some reflection helper code.