---
title: "ModClassLoader"
description: "A simple delegating class loader used to load mods into the system"
package: "net/minecraftforge/fml/common"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/ModClassLoader.html"
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
- `public boolean isDefaultLibrary(java.io.File file)`
- `public void clearNegativeCacheFor(java.util.Set<java.lang.String> classList)`
- `public ModAPITransformer addModAPITransformer( ASMDataTable dataTable)`
- `public boolean containsSource(java.io.File source)`

## Description

A simple delegating class loader used to load mods into the system
