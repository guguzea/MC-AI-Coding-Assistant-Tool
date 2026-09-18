# ReflectionHelper

## Constructors

- `public ReflectionHelper()`

## Methods

- `@Deprecated public static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String... fieldNames)`
- `public static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String fieldName, java.lang.String fieldObfName)`
- `@Deprecated public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `@Deprecated public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)`
- `public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String fieldName, java.lang.String fieldObfName)`
- `@Deprecated public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `@Deprecated public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)`
- `public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String fieldName, java.lang.String fieldObfName)`
- `public static java.lang.Class<? super java.lang.Object> getClass(java.lang.ClassLoader loader, java.lang.String... classNames)`
- `public static java.lang.reflect.Method findMethod(java.lang.Class<?> clazz, java.lang.String methodName, java.lang.String methodObfName, java.lang.Class<?>... parameterTypes)`
- `public static <T> java.lang.reflect.Constructor<T> findConstructor(java.lang.Class<T> klass, java.lang.Class<?>... parameterTypes)`

## Description

Deprecated. not for external use