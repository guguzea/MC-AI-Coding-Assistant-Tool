---
title: "ModClassVisitor"
description: "public class ModClassVisitor extends ClassVisitor"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/discovery/asm/ModClassVisitor.html"
sourceType: javadoc
---

# ModClassVisitor

**Inheritance:** java.lang.Object → ClassVisitor → net.minecraftforge.fml.common.discovery.asm.ModClassVisitor

## Class signature

```java
public class ModClassVisitor extends ClassVisitor
```

## Constructors

- `ModClassVisitor(ASMModParser discoverer)`

## Methods

- `void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `AnnotationVisitor visitAnnotation(java.lang.String annotationName, boolean runtimeVisible)`
- `FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
- `MethodVisitor visitMethod(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.String[] exceptions)`
