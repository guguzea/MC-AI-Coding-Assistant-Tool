---
title: "ModClassLoader"
description: "public class ModClassLoader extends java.net.URLClassLoader"
package: "cpw/mods/fml/common"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/ModClassLoader.html"
sourceType: javadoc
---

# ModClassLoader

**Inheritance:** java.lang.Object → java.lang.ClassLoader → java.security.SecureClassLoader → java.net.URLClassLoader → cpw.mods.fml.common.ModClassLoader

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
- `java.util.List<java.lang.String> getDefaultLibraries()`
- `java.io.File[] getParentSources()`
- `java.lang.Class<?> loadClass(java.lang.String name)`
