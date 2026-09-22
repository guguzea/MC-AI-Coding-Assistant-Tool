---
title: "ModAnnotation"
description: "public class ModAnnotation extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/discovery/asm/ModAnnotation.html"
sourceType: javadoc
---

# ModAnnotation

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.discovery.asm.ModAnnotation

## Class signature

```java
public class ModAnnotation extends java.lang.Object
```

## Constructors

- `ModAnnotation(net.minecraftforge.fml.common.discovery.asm.ASMModParser.AnnotationType type, Type asmType, ModAnnotation parent)`
- `ModAnnotation(net.minecraftforge.fml.common.discovery.asm.ASMModParser.AnnotationType type, Type asmType, java.lang.String member)`

## Methods

- `void addArray(java.lang.String name)`
- `ModAnnotation addChildAnnotation(java.lang.String name, java.lang.String desc)`
- `void addEnumProperty(java.lang.String key, java.lang.String enumName, java.lang.String value)`
- `void addProperty(java.lang.String key, java.lang.Object value)`
- `void endArray()`
- `Type getASMType()`
- `java.lang.String getMember()`
- `net.minecraftforge.fml.common.discovery.asm.ASMModParser.AnnotationType getType()`
- `java.util.Map<java.lang.String, java.lang.Object> getValues()`
- `java.lang.String toString()`
