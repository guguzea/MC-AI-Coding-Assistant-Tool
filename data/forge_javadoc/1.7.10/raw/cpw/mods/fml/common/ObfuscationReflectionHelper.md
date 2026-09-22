---
title: "ObfuscationReflectionHelper"
description: "public class ObfuscationReflectionHelper extends java.lang.Object"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/ObfuscationReflectionHelper.html"
sourceType: javadoc
---

# ObfuscationReflectionHelper

**Inheritance:** java.lang.Object → cpw.mods.fml.common.ObfuscationReflectionHelper

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
