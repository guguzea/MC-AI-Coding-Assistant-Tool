---
title: "FMLDeobfuscatingRemapper"
description: "public class FMLDeobfuscatingRemapper extends Remapper"
package: "cpw/mods/fml/common/asm/transformers/deobf"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/asm/transformers/deobf/FMLDeobfuscatingRemapper.html"
sourceType: javadoc
---

# FMLDeobfuscatingRemapper

**Inheritance:** java.lang.Object → Remapper → cpw.mods.fml.common.asm.transformers.deobf.FMLDeobfuscatingRemapper

## Class signature

```java
public class FMLDeobfuscatingRemapper extends Remapper
```

## Methods

- `java.util.Set<java.lang.String> getObfedClasses()`
- `java.lang.String getStaticFieldType(java.lang.String oldType, java.lang.String oldName, java.lang.String newType, java.lang.String newName)`
- `boolean isRemappedClass(java.lang.String className)`
- `java.lang.String map(java.lang.String typeName)`
- `java.lang.String mapFieldName(java.lang.String owner, java.lang.String name, java.lang.String desc)`
- `java.lang.String mapMethodName(java.lang.String owner, java.lang.String name, java.lang.String desc)`
- `void mergeSuperMaps(java.lang.String name, java.lang.String superName, java.lang.String[] interfaces)`
- `void setup(java.io.File mcDir, LaunchClassLoader classLoader, java.lang.String deobfFileName)`
- `void setupLoadOnly(java.lang.String deobfFileName, boolean loadAll)`
- `java.lang.String unmap(java.lang.String typeName)`

## Fields

- `static FMLDeobfuscatingRemapper INSTANCE`
