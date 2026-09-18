---
title: "DataFixer"
description: "public class DataFixer extends java.lang.Object implements IDataFixer"
package: "net/minecraft/util/datafix"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/util/datafix/DataFixer.html"
sourceType: javadoc
---

# DataFixer

## Class signature

```java
public class DataFixer extends java.lang.Object implements IDataFixer
```

## Constructors

- `public DataFixer(int versionIn)`

## Methods

- `public NBTTagCompound process( IFixType type, NBTTagCompound compound)`
- `public NBTTagCompound process( IFixType type, NBTTagCompound compound, int versionIn)`
- `public void registerWalker( FixTypes type, IDataWalker walker)`
- `public void registerWalkerAdd( IFixType type, IDataWalker walker)`
- `public void registerFix( IFixType type, IFixableData fixable)`
