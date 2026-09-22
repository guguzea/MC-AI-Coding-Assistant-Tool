---
title: "ModList"
description: "public class ModList extends java.lang.Object"
package: "net/minecraftforge/fml/relauncher/libraries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/libraries/ModList.html"
sourceType: javadoc
---

# ModList

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.libraries.ModList

## Class signature

```java
public class ModList extends java.lang.Object
```

## Constructors

- `ModList(Repository repo)`

## Methods

- `void add(Artifact artifact)`
- `boolean changed()`
- `static ModList create(java.io.File json, java.io.File mcdir)`
- `java.util.List<Artifact> flatten()`
- `java.util.List<Artifact> getArtifacts()`
- `static java.util.List<ModList> getBasicLists(java.io.File mcdir)`
- `static java.util.List<ModList> getKnownLists(java.io.File mcdir)`
- `java.lang.Object getName()`
- `Repository getRepository()`
- `void save()`
