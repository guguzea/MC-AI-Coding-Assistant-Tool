---
title: "ModCandidate"
description: "public class ModCandidate extends java.lang.Object"
package: "cpw/mods/fml/common/discovery"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/discovery/ModCandidate.html"
sourceType: javadoc
---

# ModCandidate

**Inheritance:** java.lang.Object → cpw.mods.fml.common.discovery.ModCandidate

## Class signature

```java
public class ModCandidate extends java.lang.Object
```

## Constructors

- `ModCandidate(java.io.File classPathRoot, java.io.File modContainer, ContainerType sourceType)`
- `ModCandidate(java.io.File classPathRoot, java.io.File modContainer, ContainerType sourceType, boolean isMinecraft, boolean classpath)`

## Methods

- `void addClassEntry(java.lang.String name)`
- `java.util.List<ModContainer> explore(ASMDataTable table)`
- `java.util.Set<java.lang.String> getClassList()`
- `java.io.File getClassPathRoot()`
- `java.util.List<ModContainer> getContainedMods()`
- `java.util.List<java.lang.String> getContainedPackages()`
- `java.io.File getModContainer()`
- `java.util.List<java.lang.String> getRememberedBaseMods()`
- `ContainerType getSourceType()`
- `boolean isClasspath()`
- `boolean isMinecraftJar()`
- `void rememberBaseModType(java.lang.String className)`
- `void rememberModCandidateType(ASMModParser modParser)`
