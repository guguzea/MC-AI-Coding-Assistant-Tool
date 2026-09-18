---
title: "ModAnnotation"
description: "public class ModAnnotation extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/discovery/asm/ModAnnotation.html"
sourceType: javadoc
---

# ModAnnotation

## Class signature

```java
public class ModAnnotation extends java.lang.Object
```

## Constructors

- `public ModAnnotation(net.minecraftforge.fml.common.discovery.asm.ASMModParser.AnnotationType type, org.objectweb.asm.Type asmType, java.lang.String member)`
- `public ModAnnotation(net.minecraftforge.fml.common.discovery.asm.ASMModParser.AnnotationType type, org.objectweb.asm.Type asmType, ModAnnotation parent)`

## Methods

- `public java.lang.String toString()`
- `public net.minecraftforge.fml.common.discovery.asm.ASMModParser.AnnotationType getType()`
- `public org.objectweb.asm.Type getASMType()`
- `public java.lang.String getMember()`
- `public java.util.Map<java.lang.String,java.lang.Object> getValues()`
- `public void addArray(java.lang.String name)`
- `public void addProperty(java.lang.String key, java.lang.Object value)`
- `public void addEnumProperty(java.lang.String key, java.lang.String enumName, java.lang.String value)`
- `public void endArray()`
- `public ModAnnotation addChildAnnotation(java.lang.String name, java.lang.String desc)`
