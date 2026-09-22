---
title: "ObfuscationReflectionHelper"
description: "public class ObfuscationReflectionHelper extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/ObfuscationReflectionHelper.html"
sourceType: javadoc
---

# ObfuscationReflectionHelper

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.ObfuscationReflectionHelper

## Class signature

```java
public class ObfuscationReflectionHelper extends java.lang.Object
```

## Constructors

- `ObfuscationReflectionHelper()`

## Methods

- `static<T> java.lang.reflect.Constructor<T> findConstructor(java.lang.Class<T> klass, java.lang.Class<?>... parameterTypes)` — Finds a constructor in the specified class that has matching parameter types.
- `static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String srgName)` — Finds a field with the specified name in the given class and makes it accessible.
- `static java.lang.reflect.Method findMethod(java.lang.Class<?> clazz, java.lang.String srgName, java.lang.Class<?> returnType, java.lang.Class<?>... parameterTypes)` — Finds a method with the specified name and parameters in the given class and makes it accessible.
- `@Deprecated static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `@Deprecated static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)` — Deprecated. use getPrivateValue(Class, Object, String)
- `static<T, E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String srgName)`
- `@Deprecated static java.lang.String[] remapFieldNames(java.lang.String className, java.lang.String... fieldNames)`
- `@Deprecated static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `@Deprecated static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)` — Deprecated. use setPrivateValue(Class, Object, Object, String)
- `static<T, E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String srgName)`
