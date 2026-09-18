---
title: "ModCandidate"
description: "public class ModCandidate extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/discovery/ModCandidate.html"
sourceType: javadoc
---

# ModCandidate

## Class signature

```java
public class ModCandidate extends java.lang.Object
```

## Constructors

- `public ModCandidate(java.io.File classPathRoot, java.io.File modContainer, ContainerType sourceType)`
- `public ModCandidate(java.io.File classPathRoot, java.io.File modContainer, ContainerType sourceType, boolean isMinecraft, boolean classpath)`

## Methods

- `public java.io.File getClassPathRoot()`
- `public java.io.File getModContainer()`
- `public ContainerType getSourceType()`
- `public java.util.List< ModContainer > explore( ASMDataTable table)`
- `public void addClassEntry(java.lang.String name)`
- `public boolean isClasspath()`
- `public boolean isMinecraftJar()`
- `public java.util.Set<java.lang.String> getClassList()`
- `public java.util.List< ModContainer > getContainedMods()`
- `public java.util.List<java.lang.String> getContainedPackages()`
