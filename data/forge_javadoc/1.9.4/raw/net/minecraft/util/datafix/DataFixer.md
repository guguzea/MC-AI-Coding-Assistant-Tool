---
title: "DataFixer"
description: "public class DataFixer extends java.lang.Object implements IDataFixer"
package: "net/minecraft/util/datafix"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/datafix/DataFixer.html"
sourceType: javadoc
---

# DataFixer

**Inheritance:** java.lang.Object → net.minecraft.util.datafix.DataFixer

## Class signature

```java
public class DataFixer extends java.lang.Object implements IDataFixer
```

## Constructors

- `DataFixer(int versionIn)`

## Methods

- `NBTTagCompound process(IFixType type, NBTTagCompound compound)`
- `NBTTagCompound process(IFixType type, NBTTagCompound compound, int versionIn)`
- `void registerFix(IFixType type, IFixableData fixable)`
- `void registerWalker(FixTypes type, IDataWalker walker)`
- `void registerWalkerAdd(IFixType type, IDataWalker walker)`
