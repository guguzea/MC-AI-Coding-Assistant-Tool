---
title: "ModCandidate"
description: "public class ModCandidate extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/discovery/ModCandidate.html"
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
- `public void rememberBaseModType(java.lang.String className)`
- `public java.util.List<java.lang.String> getRememberedBaseMods()`
- `public boolean isMinecraftJar()`
- `public void rememberModCandidateType( ASMModParser modParser)`
- `public java.util.Set<java.lang.String> getClassList()`
- `public java.util.List< ModContainer > getContainedMods()`
- `public java.util.List<java.lang.String> getContainedPackages()`
