---
title: "FMLDeobfuscatingRemapper"
description: "public class FMLDeobfuscatingRemapper extends Remapper"
package: "net/minecraftforge/fml/common/asm/transformers/deobf"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/asm/transformers/deobf/FMLDeobfuscatingRemapper.html"
sourceType: javadoc
---

# FMLDeobfuscatingRemapper

**Inheritance:** java.lang.Object → Remapper → net.minecraftforge.fml.common.asm.transformers.deobf.FMLDeobfuscatingRemapper

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
- `java.lang.String mapSignature(java.lang.String signature, boolean typeSignature)`
- `void mergeSuperMaps(java.lang.String name, java.lang.String superName, java.lang.String[] interfaces)`
- `void setup(java.io.File mcDir, LaunchClassLoader classLoader, java.lang.String deobfFileName)`
- `void setupLoadOnly(java.lang.String deobfFileName, boolean loadAll)`
- `java.lang.String unmap(java.lang.String typeName)`

## Fields

- `static FMLDeobfuscatingRemapper INSTANCE`
