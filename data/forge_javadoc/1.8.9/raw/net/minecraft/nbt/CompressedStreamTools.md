---
title: "CompressedStreamTools"
description: "Reads the given DataInput, constructs, and returns an NBTTagCompound with the data from the DataInput"
package: "net/minecraft/nbt"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/nbt/CompressedStreamTools.html"
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
- `public static void writeCompressed( NBTTagCompound p_74799_0_, java.io.OutputStream outputStream) throws java.io.IOException`
- `public static void safeWrite( NBTTagCompound p_74793_0_, java.io.File p_74793_1_) throws java.io.IOException`
- `public static NBTTagCompound read(java.io.DataInputStream inputStream) throws java.io.IOException`
- `public static NBTTagCompound read(java.io.DataInput p_152456_0_, NBTSizeTracker p_152456_1_) throws java.io.IOException`
- `public static void write( NBTTagCompound p_74800_0_, java.io.DataOutput p_74800_1_) throws java.io.IOException`
- `public static void write( NBTTagCompound p_74795_0_, java.io.File p_74795_1_) throws java.io.IOException`
- `public static NBTTagCompound read(java.io.File p_74797_0_) throws java.io.IOException`

## Description

Reads the given DataInput, constructs, and returns an NBTTagCompound with the data from the DataInput
