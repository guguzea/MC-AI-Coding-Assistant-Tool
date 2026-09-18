---
title: "ObfuscationReflectionHelper"
description: "Some reflection helper code."
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/ObfuscationReflectionHelper.html"
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

- `public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, int fieldIndex)`
- `public static java.lang.String[] remapFieldNames(java.lang.String className, java.lang.String... fieldNames)`
- `public static <T,E> T getPrivateValue(java.lang.Class<? super E> classToAccess, E instance, java.lang.String... fieldNames)`
- `public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, int fieldIndex)`
- `public static <T,E> void setPrivateValue(java.lang.Class<? super T> classToAccess, T instance, E value, java.lang.String... fieldNames)`

## Description

Some reflection helper code.
