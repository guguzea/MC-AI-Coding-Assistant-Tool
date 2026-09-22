---
title: "ModAnnotationVisitor"
description: "public class ModAnnotationVisitor extends AnnotationVisitor"
package: "cpw/mods/fml/common/discovery/asm"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/discovery/asm/ModAnnotationVisitor.html"
sourceType: javadoc
---

# ModAnnotationVisitor

**Inheritance:** java.lang.Object → AnnotationVisitor → cpw.mods.fml.common.discovery.asm.ModAnnotationVisitor

## Class signature

```java
public class ModAnnotationVisitor extends AnnotationVisitor
```

## Constructors

- `ModAnnotationVisitor(ASMModParser discoverer)`
- `ModAnnotationVisitor(ASMModParser discoverer, boolean isSubAnnotation)`
- `ModAnnotationVisitor(ASMModParser discoverer, java.lang.String name)`

## Methods

- `void visit(java.lang.String key, java.lang.Object value)`
- `AnnotationVisitor visitAnnotation(java.lang.String name, java.lang.String desc)`
- `AnnotationVisitor visitArray(java.lang.String name)`
- `void visitEnd()`
- `void visitEnum(java.lang.String name, java.lang.String desc, java.lang.String value)`
