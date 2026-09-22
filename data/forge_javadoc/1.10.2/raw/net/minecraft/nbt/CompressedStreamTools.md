---
title: "CompressedStreamTools"
description: "public class CompressedStreamTools extends java.lang.Object"
package: "net/minecraft/nbt"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/nbt/CompressedStreamTools.html"
sourceType: javadoc
---

# CompressedStreamTools

**Inheritance:** java.lang.Object → net.minecraft.nbt.CompressedStreamTools

## Class signature

```java
public class CompressedStreamTools extends java.lang.Object
```

## Constructors

- `CompressedStreamTools()`

## Methods

- `static NBTTagCompound read(java.io.DataInput input, NBTSizeTracker accounter)`
- `static NBTTagCompound read(java.io.DataInputStream inputStream)`
- `static NBTTagCompound read(java.io.File fileIn)`
- `static NBTTagCompound readCompressed(java.io.InputStream is)`
- `static void safeWrite(NBTTagCompound compound, java.io.File fileIn)`
- `static void write(NBTTagCompound compound, java.io.DataOutput output)`
- `static void write(NBTTagCompound compound, java.io.File fileIn)`
- `static void writeCompressed(NBTTagCompound compound, java.io.OutputStream outputStream)`
