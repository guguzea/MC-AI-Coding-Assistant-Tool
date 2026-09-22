---
title: "FMLRemappingAdapter"
description: "public class FMLRemappingAdapter extends RemappingClassAdapter"
package: "net/minecraftforge/fml/common/asm/transformers/deobf"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/asm/transformers/deobf/FMLRemappingAdapter.html"
sourceType: javadoc
---

# FMLRemappingAdapter

**Inheritance:** java.lang.Object → RemappingClassAdapter → net.minecraftforge.fml.common.asm.transformers.deobf.FMLRemappingAdapter

## Class signature

```java
public class FMLRemappingAdapter extends RemappingClassAdapter
```

## Constructors

- `FMLRemappingAdapter(ClassVisitor cv)`

## Methods

- `protected MethodVisitor createRemappingMethodAdapter(int access, java.lang.String newDesc, MethodVisitor mv)`
- `void visit(int version, int access, java.lang.String name, java.lang.String signature, java.lang.String superName, java.lang.String[] interfaces)`
- `FieldVisitor visitField(int access, java.lang.String name, java.lang.String desc, java.lang.String signature, java.lang.Object value)`
