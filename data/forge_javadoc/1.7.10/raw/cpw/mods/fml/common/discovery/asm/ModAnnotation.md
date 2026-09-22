---
title: "ModAnnotation"
description: "public class ModAnnotation extends java.lang.Object"
package: "cpw/mods/fml/common/discovery/asm"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/discovery/asm/ModAnnotation.html"
sourceType: javadoc
---

# ModAnnotation

**Inheritance:** java.lang.Object → cpw.mods.fml.common.discovery.asm.ModAnnotation

## Class signature

```java
public class ModAnnotation extends java.lang.Object
```

## Constructors

- `ModAnnotation(cpw.mods.fml.common.discovery.asm.ASMModParser.AnnotationType type, Type asmType, ModAnnotation parent)`
- `ModAnnotation(cpw.mods.fml.common.discovery.asm.ASMModParser.AnnotationType type, Type asmType, java.lang.String member)`

## Methods

- `void addArray(java.lang.String name)`
- `ModAnnotation addChildAnnotation(java.lang.String name, java.lang.String desc)`
- `void addEnumProperty(java.lang.String key, java.lang.String enumName, java.lang.String value)`
- `void addProperty(java.lang.String key, java.lang.Object value)`
- `void endArray()`
- `Type getASMType()`
- `java.lang.String getMember()`
- `cpw.mods.fml.common.discovery.asm.ASMModParser.AnnotationType getType()`
- `java.util.Map<java.lang.String, java.lang.Object> getValues()`
- `java.lang.String toString()`
