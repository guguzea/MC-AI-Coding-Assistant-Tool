---
title: "ModContainerFactory"
description: "public class ModContainerFactory extends java.lang.Object"
package: "net/minecraftforge/fml/common"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/ModContainerFactory.html"
sourceType: javadoc
---

# ModContainerFactory

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.ModContainerFactory

## Class signature

```java
public class ModContainerFactory extends java.lang.Object
```

## Methods

- `ModContainer build(ASMModParser modParser, java.io.File modSource, ModCandidate container)`
- `static ModContainerFactory instance()`
- `void registerContainerType(org.objectweb.asm.Type type, java.lang.Class<? extends ModContainer> container)`

## Fields

- `static java.util.Map<org.objectweb.asm.Type, java.lang.reflect.Constructor<? extends ModContainer>> modTypes`
