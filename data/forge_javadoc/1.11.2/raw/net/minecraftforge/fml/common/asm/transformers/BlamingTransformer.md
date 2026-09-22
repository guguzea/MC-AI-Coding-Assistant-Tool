---
title: "BlamingTransformer"
description: "public class BlamingTransformer extends java.lang.Object implements net.minecraft.launchwrapper.IClassTransformer"
package: "net/minecraftforge/fml/common/asm/transformers"
version: "1.11.2"
forgeBuild: "13.20.0.2228"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/asm/transformers/BlamingTransformer.html"
sourceType: javadoc
---

# BlamingTransformer

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.asm.transformers.BlamingTransformer

## Class signature

```java
public class BlamingTransformer extends java.lang.Object implements net.minecraft.launchwrapper.IClassTransformer
```

## Constructors

- `BlamingTransformer()`

## Methods

- `static void addClasses(java.lang.String modId, java.util.Set<java.lang.String> classList)`
- `static void blame(java.lang.String modId, java.lang.String cls)`
- `static void onCrash(java.lang.StringBuilder builder)`
- `byte[] transform(java.lang.String name, java.lang.String transformedName, byte[] bytes)`
