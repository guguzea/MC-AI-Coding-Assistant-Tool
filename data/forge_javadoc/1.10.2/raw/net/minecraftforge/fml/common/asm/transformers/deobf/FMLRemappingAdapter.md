---
title: "FMLRemappingAdapter"
description: "public class FMLRemappingAdapter extends org.objectweb.asm.commons.RemappingClassAdapter"
package: "net/minecraftforge/fml/common/asm/transformers/deobf"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/asm/transformers/deobf/FMLRemappingAdapter.html"
sourceType: javadoc
---

# FMLRemappingAdapter

## Class signature

```java
public class FMLRemappingAdapter extends org.objectweb.asm.commons.RemappingClassAdapter
```

## Constructors

- `public FMLRemappingAdapter(org.objectweb.asm.ClassVisitor cv)`

## Methods

- `public void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `public org.objectweb.asm.FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
- `protected org.objectweb.asm.MethodVisitor createRemappingMethodAdapter(int access, java.lang.String newDesc, org.objectweb.asm.MethodVisitor mv)`
