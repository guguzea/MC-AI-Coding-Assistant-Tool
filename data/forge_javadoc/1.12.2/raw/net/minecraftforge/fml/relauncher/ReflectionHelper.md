---
title: "ReflectionHelper"
description: "public class ReflectionHelper extends java.lang.Object"
package: "net/minecraftforge/fml/relauncher"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/ReflectionHelper.html"
sourceType: javadoc
---

# ReflectionHelper

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.ReflectionHelper

## Class signature

```java
public class ReflectionHelper extends java.lang.Object
```

## Constructors

- `@Deprecated ReflectionHelper()`

## Methods

- `@Deprecated static<T> java.lang.reflect.Constructor<T> findConstructor(java.lang.Class<T> klass, java.lang.Class<?>... parameterTypes)`
- `@Deprecated static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String... fieldNames)` — Deprecated. use findField(Class, String, String)
- `@Deprecated static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String fieldName, java.lang.String fieldObfName)`
- `@Deprecated static java.lang.reflect.Method findMethod(java.lang.Class<?> clazz, java.lang.String methodName, java.lang.String methodObfName, java.lang.Class<?>... parameterTypes)`
- `@Deprecated static java.lang.Class<? super java.lang.Object> getClass(java.lang.ClassLoader loader, java.lang.String... classNames)`
- `@Deprecated static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `@Deprecated static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)` — Deprecated. use getPrivateValue(Class, Object, String, String )
- `@Deprecated static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String fieldName, java.lang.String fieldObfName)`
- `@Deprecated static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `@Deprecated static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)` — Deprecated. use setPrivateValue(Class, Object, Object, String, String)
- `@Deprecated static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String fieldName, java.lang.String fieldObfName)`
