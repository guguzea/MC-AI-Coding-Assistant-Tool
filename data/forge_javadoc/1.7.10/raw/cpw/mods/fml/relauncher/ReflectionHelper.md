---
title: "ReflectionHelper"
description: "public class ReflectionHelper extends java.lang.Object"
package: "cpw/mods/fml/relauncher"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/relauncher/ReflectionHelper.html"
sourceType: javadoc
---

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
