---
title: "ASMDataTable"
description: "public class ASMDataTable extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/discovery/ASMDataTable.html"
sourceType: javadoc
---

# ASMDataTable

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.discovery.ASMDataTable

## Class signature

```java
public class ASMDataTable extends java.lang.Object
```

## Constructors

- `ASMDataTable()`

## Methods

- `void addASMData(ModCandidate candidate, java.lang.String annotation, java.lang.String className, java.lang.String objectName, java.util.Map<java.lang.String, java.lang.Object> annotationInfo)`
- `void addContainer(ModContainer container)`
- `java.util.Set<ASMDataTable.ASMData> getAll(java.lang.String annotation)`
- `com.google.common.collect.SetMultimap<java.lang.String, ASMDataTable.ASMData> getAnnotationsFor(ModContainer container)`
- `java.util.Set<ModCandidate> getCandidatesFor(java.lang.String pkg)`
- `void registerPackage(ModCandidate modCandidate, java.lang.String pkg)`
