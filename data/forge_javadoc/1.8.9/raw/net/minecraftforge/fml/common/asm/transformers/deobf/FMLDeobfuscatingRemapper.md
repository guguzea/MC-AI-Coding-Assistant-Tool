---
title: "FMLDeobfuscatingRemapper"
description: "public class FMLDeobfuscatingRemapper extends Remapper"
package: "net/minecraftforge/fml/common/asm/transformers/deobf"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/asm/transformers/deobf/FMLDeobfuscatingRemapper.html"
sourceType: javadoc
---

# FMLDeobfuscatingRemapper

## Class signature

```java
public class FMLDeobfuscatingRemapper extends Remapper
```

## Methods

- `public void setupLoadOnly(java.lang.String deobfFileName, boolean loadAll)`
- `public void setup(java.io.File mcDir, LaunchClassLoader classLoader, java.lang.String deobfFileName)`
- `public boolean isRemappedClass(java.lang.String className)`
- `public java.lang.String mapFieldName(java.lang.String owner, java.lang.String name, java.lang.String desc)`
- `public java.lang.String map(java.lang.String typeName)`
- `public java.lang.String unmap(java.lang.String typeName)`
- `public java.lang.String mapMethodName(java.lang.String owner, java.lang.String name, java.lang.String desc)`
- `public java.lang.String mapSignature(java.lang.String signature, boolean typeSignature)`
- `public void mergeSuperMaps(java.lang.String name, java.lang.String superName, java.lang.String[] interfaces)`
- `public java.util.Set<java.lang.String> getObfedClasses()`
- `public java.lang.String getStaticFieldType(java.lang.String oldType, java.lang.String oldName, java.lang.String newType, java.lang.String newName)`
