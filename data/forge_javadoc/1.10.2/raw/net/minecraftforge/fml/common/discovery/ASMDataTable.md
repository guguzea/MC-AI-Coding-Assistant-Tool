---
title: "ASMDataTable"
description: "public class ASMDataTable extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/discovery/ASMDataTable.html"
sourceType: javadoc
---

# ASMDataTable

## Class signature

```java
public class ASMDataTable extends java.lang.Object
```

## Constructors

- `public ASMDataTable()`

## Methods

- `public com.google.common.collect.SetMultimap<java.lang.String, ASMDataTable.ASMData > getAnnotationsFor( ModContainer container)`
- `public java.util.Set< ASMDataTable.ASMData > getAll(java.lang.String annotation)`
- `public void addASMData( ModCandidate candidate, java.lang.String annotation, java.lang.String className, java.lang.String objectName, java.util.Map<java.lang.String,java.lang.Object> annotationInfo)`
- `public void addContainer( ModContainer container)`
- `public void registerPackage( ModCandidate modCandidate, java.lang.String pkg)`
- `public java.util.Set< ModCandidate > getCandidatesFor(java.lang.String pkg)`
