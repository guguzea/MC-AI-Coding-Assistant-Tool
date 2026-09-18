---
title: "ASMDataTable"
description: "public class ASMDataTable extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/discovery/ASMDataTable.html"
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

- `public <any> getAnnotationsFor( ModContainer container)`
- `public java.util.Set< ASMDataTable.ASMData > getAll(java.lang.String annotation)`
- `public void addASMData( ModCandidate candidate, java.lang.String annotation, java.lang.String className, java.lang.String objectName, java.util.Map<java.lang.String,java.lang.Object> annotationInfo)`
- `public void addContainer( ModContainer container)`
- `public void registerPackage( ModCandidate modCandidate, java.lang.String pkg)`
- `public java.util.Set< ModCandidate > getCandidatesFor(java.lang.String pkg)`
- `public static java.lang.String getOwnerModID(java.util.Set< ASMDataTable.ASMData > mods, ASMDataTable.ASMData targ)`
