---
title: "ModClassVisitor"
description: "public class ModClassVisitor extends org.objectweb.asm.ClassVisitor"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/discovery/asm/ModClassVisitor.html"
sourceType: javadoc
---

# ModClassVisitor

## Class signature

```java
public class ModClassVisitor extends org.objectweb.asm.ClassVisitor
```

## Constructors

- `public ModClassVisitor( ASMModParser discoverer)`

## Methods

- `public void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `public org.objectweb.asm.AnnotationVisitor visitAnnotation(java.lang.String annotationName, boolean runtimeVisible)`
- `public org.objectweb.asm.FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
- `public org.objectweb.asm.MethodVisitor visitMethod(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.String[] exceptions)`
