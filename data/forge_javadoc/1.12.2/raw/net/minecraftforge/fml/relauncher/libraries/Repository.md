---
title: "Repository"
description: "public class Repository extends java.lang.Object"
package: "net/minecraftforge/fml/relauncher/libraries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/libraries/Repository.html"
sourceType: javadoc
---

# Repository

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.libraries.Repository

## Class signature

```java
public class Repository extends java.lang.Object
```

## Constructors

- `Repository(java.io.File root)`
- `Repository(java.io.File root, java.lang.String name)`

## Methods

- `java.io.File archive(Artifact artifact, java.io.File file, byte[] manifest)`
- `static Repository create(java.io.File root)`
- `static Repository create(java.io.File root, java.lang.String name)`
- `boolean equals(java.lang.Object o)`
- `void filterLegacy(java.util.List<java.io.File> list)`
- `static Repository get(java.lang.String name)`
- `java.io.File getFile(java.lang.String path)`
- `int hashCode()`
- `static Repository replace(java.io.File root, java.lang.String name)`
- `Artifact resolve(Artifact artifact)`
- `static Artifact resolveAll(Artifact artifact)`
