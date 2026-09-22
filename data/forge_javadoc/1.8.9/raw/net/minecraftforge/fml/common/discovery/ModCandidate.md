---
title: "ModCandidate"
description: "public class ModCandidate extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/discovery/ModCandidate.html"
sourceType: javadoc
---

# ModCandidate

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.discovery.ModCandidate

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
