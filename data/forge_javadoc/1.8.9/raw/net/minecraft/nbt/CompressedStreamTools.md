---
title: "CompressedStreamTools"
description: "public class CompressedStreamTools extends java.lang.Object"
package: "net/minecraft/nbt"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/nbt/CompressedStreamTools.html"
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

- `static NBTTagCompound read(java.io.DataInput p_152456_0_, NBTSizeTracker p_152456_1_)` — Reads the given DataInput, constructs, and returns an NBTTagCompound with the data from the DataInput
- `static NBTTagCompound read(java.io.DataInputStream inputStream)` — Reads from a CompressedStream.
- `static NBTTagCompound read(java.io.File p_74797_0_)`
- `static NBTTagCompound readCompressed(java.io.InputStream is)` — Load the gzipped compound from the inputstream.
- `static void safeWrite(NBTTagCompound p_74793_0_, java.io.File p_74793_1_)`
- `static void write(NBTTagCompound p_74800_0_, java.io.DataOutput p_74800_1_)`
- `static void write(NBTTagCompound p_74795_0_, java.io.File p_74795_1_)`
- `static void writeCompressed(NBTTagCompound p_74799_0_, java.io.OutputStream outputStream)` — Write the compound, gzipped, to the outputstream.
