---
title: "ModClassVisitor"
description: "public class ModClassVisitor extends ClassVisitor"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/discovery/asm/ModClassVisitor.html"
sourceType: javadoc
---

# ModClassVisitor

## Class signature

```java
public class ModClassVisitor extends ClassVisitor
```

## Constructors

- `public ModClassVisitor( ASMModParser discoverer)`

## Methods

- `public void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `public AnnotationVisitor visitAnnotation(java.lang.String annotationName, boolean runtimeVisible)`
- `public FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
- `public MethodVisitor visitMethod(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.String[] exceptions)`
