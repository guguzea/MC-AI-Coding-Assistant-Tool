---
title: "ModAnnotationVisitor"
description: "public class ModAnnotationVisitor extends AnnotationVisitor"
package: "net/minecraftforge/fml/common/discovery/asm"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/discovery/asm/ModAnnotationVisitor.html"
sourceType: javadoc
---

# ModAnnotationVisitor

## Class signature

```java
public class ModAnnotationVisitor extends AnnotationVisitor
```

## Constructors

- `public ModAnnotationVisitor( ASMModParser discoverer)`
- `public ModAnnotationVisitor( ASMModParser discoverer, java.lang.String name)`
- `public ModAnnotationVisitor( ASMModParser discoverer, boolean isSubAnnotation)`

## Methods

- `public void visit(java.lang.String key, java.lang.Object value)`
- `public void visitEnum(java.lang.String name, java.lang.String desc, java.lang.String value)`
- `public AnnotationVisitor visitArray(java.lang.String name)`
- `public AnnotationVisitor visitAnnotation(java.lang.String name, java.lang.String desc)`
- `public void visitEnd()`
