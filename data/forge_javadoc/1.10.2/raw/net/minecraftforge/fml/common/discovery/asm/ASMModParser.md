---
title: "ASMModParser"
description: "public class ASMModParser extends java.lang.Object"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/discovery/asm/ASMModParser.html"
sourceType: javadoc
---

# ASMModParser

## Class signature

```java
public class ASMModParser extends java.lang.Object
```

## Constructors

- `public ASMModParser(java.io.InputStream stream) throws java.io.IOException`

## Methods

- `public void beginNewTypeName(java.lang.String typeQName, int classVersion, java.lang.String superClassQName, java.lang.String[] interfaces)`
- `public void startClassAnnotation(java.lang.String annotationName)`
- `public void addAnnotationProperty(java.lang.String key, java.lang.Object value)`
- `public void startFieldAnnotation(java.lang.String fieldName, java.lang.String annotationName)`
- `public java.lang.String toString()`
- `public org.objectweb.asm.Type getASMType()`
- `public int getClassVersion()`
- `public org.objectweb.asm.Type getASMSuperType()`
- `public java.util.LinkedList< ModAnnotation > getAnnotations()`
- `public void validate()`
- `public boolean isBaseMod(java.util.List<java.lang.String> rememberedTypes)`
- `public void setBaseModProperties(java.lang.String foundProperties)`
- `public java.lang.String getBaseModProperties()`
- `public void sendToTable( ASMDataTable table, ModCandidate candidate)`
- `public void addAnnotationArray(java.lang.String name)`
- `public void addAnnotationEnumProperty(java.lang.String name, java.lang.String desc, java.lang.String value)`
- `public void endArray()`
- `public void addSubAnnotation(java.lang.String name, java.lang.String desc)`
- `public void endSubAnnotation()`
- `public void startMethodAnnotation(java.lang.String methodName, java.lang.String methodDescriptor, java.lang.String annotationName)`
