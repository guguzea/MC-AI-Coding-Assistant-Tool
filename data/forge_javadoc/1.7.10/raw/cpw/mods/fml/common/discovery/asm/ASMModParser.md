---
title: "ASMModParser"
description: "public class ASMModParser extends java.lang.Object"
package: "cpw/mods/fml/common/discovery/asm"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/discovery/asm/ASMModParser.html"
sourceType: javadoc
---

# ASMModParser

**Inheritance:** java.lang.Object → cpw.mods.fml.common.discovery.asm.ASMModParser

## Class signature

```java
public class ASMModParser extends java.lang.Object
```

## Constructors

- `ASMModParser(java.io.InputStream stream)`

## Methods

- `void addAnnotationArray(java.lang.String name)`
- `void addAnnotationEnumProperty(java.lang.String name, java.lang.String desc, java.lang.String value)`
- `void addAnnotationProperty(java.lang.String key, java.lang.Object value)`
- `void addSubAnnotation(java.lang.String name, java.lang.String desc)`
- `void beginNewTypeName(java.lang.String typeQName, int classVersion, java.lang.String superClassQName)`
- `void endArray()`
- `void endSubAnnotation()`
- `java.util.LinkedList<ModAnnotation> getAnnotations()`
- `Type getASMSuperType()`
- `Type getASMType()`
- `java.lang.String getBaseModProperties()`
- `int getClassVersion()`
- `boolean isBaseMod(java.util.List<java.lang.String> rememberedTypes)`
- `void sendToTable(ASMDataTable table, ModCandidate candidate)`
- `void setBaseModProperties(java.lang.String foundProperties)`
- `void startClassAnnotation(java.lang.String annotationName)`
- `void startFieldAnnotation(java.lang.String fieldName, java.lang.String annotationName)`
- `void startMethodAnnotation(java.lang.String methodName, java.lang.String methodDescriptor, java.lang.String annotationName)`
- `java.lang.String toString()`
- `void validate()`
