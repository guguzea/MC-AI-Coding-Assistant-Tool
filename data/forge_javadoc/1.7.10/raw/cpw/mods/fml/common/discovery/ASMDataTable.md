---
title: "ASMDataTable"
description: "public class ASMDataTable extends java.lang.Object"
package: "cpw/mods/fml/common/discovery"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/discovery/ASMDataTable.html"
sourceType: javadoc
---

# ASMDataTable

**Inheritance:** java.lang.Object → cpw.mods.fml.common.discovery.ASMDataTable

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
- `<any> getAnnotationsFor(ModContainer container)`
- `java.util.Set<ModCandidate> getCandidatesFor(java.lang.String pkg)`
- `void registerPackage(ModCandidate modCandidate, java.lang.String pkg)`
