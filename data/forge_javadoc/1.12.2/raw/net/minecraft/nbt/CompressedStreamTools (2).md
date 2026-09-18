---
title: "CompressedStreamTools"
description: "public class CompressedStreamTools extends java.lang.Object"
package: "net/minecraft/nbt"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/nbt/CompressedStreamTools.html"
sourceType: javadoc
---

# CompressedStreamTools

## Class signature

```java
public class CompressedStreamTools extends java.lang.Object
```

## Constructors

- `public CompressedStreamTools()`

## Methods

- `public static NBTTagCompound readCompressed(java.io.InputStream is) throws java.io.IOException`
- `public static void writeCompressed( NBTTagCompound compound, java.io.OutputStream outputStream) throws java.io.IOException`
- `public static void safeWrite( NBTTagCompound compound, java.io.File fileIn) throws java.io.IOException`
- `public static NBTTagCompound read(java.io.DataInputStream inputStream) throws java.io.IOException`
- `public static NBTTagCompound read(java.io.DataInput input, NBTSizeTracker accounter) throws java.io.IOException`
- `public static void write( NBTTagCompound compound, java.io.DataOutput output) throws java.io.IOException`
- `public static void write( NBTTagCompound compound, java.io.File fileIn) throws java.io.IOException`
- `public static NBTTagCompound read(java.io.File fileIn) throws java.io.IOException`
