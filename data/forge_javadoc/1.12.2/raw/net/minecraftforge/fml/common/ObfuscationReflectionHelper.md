---
title: "ObfuscationReflectionHelper"
description: "Some reflection helper code."
package: "net/minecraftforge/fml/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/ObfuscationReflectionHelper.html"
sourceType: javadoc
---

# ObfuscationReflectionHelper

## Class signature

```java
public class ObfuscationReflectionHelper extends java.lang.Object
```

## Constructors

- `public ObfuscationReflectionHelper()`

## Methods

- `@Deprecated public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `@Deprecated public static java.lang.String[] remapFieldNames(java.lang.String className, java.lang.String... fieldNames)`
- `@Deprecated public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)`
- `public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String srgName)`
- `@Deprecated public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `@Deprecated public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)`
- `public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String srgName)`
- `public static java.lang.reflect.Field findField(java.lang.Class<?> clazz, java.lang.String srgName)`
- `public static java.lang.reflect.Method findMethod(java.lang.Class<?> clazz, java.lang.String srgName, java.lang.Class<?> returnType, java.lang.Class<?>... parameterTypes)`
- `public static <T> java.lang.reflect.Constructor<T> findConstructor(java.lang.Class<T> klass, java.lang.Class<?>... parameterTypes)`

## Description

Some reflection helper code.
