---
title: "ModClassLoader"
description: "A simple delegating class loader used to load mods into the system"
package: "cpw/mods/fml/common"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/ModClassLoader.html"
sourceType: javadoc
---

# ModClassLoader

## Class signature

```java
public class ModClassLoader extends java.net.URLClassLoader
```

## Constructors

- `public ModClassLoader(java.lang.ClassLoader parent)`

## Methods

- `public void addFile(java.io.File modFile) throws java.net.MalformedURLException`
- `public java.lang.Class<?> loadClass(java.lang.String name) throws java.lang.ClassNotFoundException`
- `public java.io.File[] getParentSources()`
- `public java.util.List<java.lang.String> getDefaultLibraries()`
- `public void clearNegativeCacheFor(java.util.Set<java.lang.String> classList)`
- `public ModAPITransformer addModAPITransformer( ASMDataTable dataTable)`

## Description

A simple delegating class loader used to load mods into the system
