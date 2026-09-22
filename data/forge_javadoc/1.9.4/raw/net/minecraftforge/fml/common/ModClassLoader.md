---
title: "ModClassLoader"
description: "public class ModClassLoader extends java.net.URLClassLoader"
package: "net/minecraftforge/fml/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/ModClassLoader.html"
sourceType: javadoc
---

# ModClassLoader

**Inheritance:** java.lang.Object → java.lang.ClassLoader → java.security.SecureClassLoader → java.net.URLClassLoader → net.minecraftforge.fml.common.ModClassLoader

## Class signature

```java
public class ModClassLoader extends java.net.URLClassLoader
```

## Constructors

- `ModClassLoader(java.lang.ClassLoader parent)`

## Methods

- `void addFile(java.io.File modFile)`
- `ModAPITransformer addModAPITransformer(ASMDataTable dataTable)`
- `void clearNegativeCacheFor(java.util.Set<java.lang.String> classList)`
- `boolean containsSource(java.io.File source)`
- `java.util.List<java.lang.String> getDefaultLibraries()`
- `java.io.File[] getParentSources()`
- `boolean isDefaultLibrary(java.io.File file)`
- `java.lang.Class<?> loadClass(java.lang.String name)`
