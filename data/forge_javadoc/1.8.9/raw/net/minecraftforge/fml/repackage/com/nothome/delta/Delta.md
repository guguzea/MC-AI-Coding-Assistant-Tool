---
title: "Delta"
description: "Class for computing deltas against a source. The source file is read by blocks and a hash is computed per block. Then the target is scanned for matching blocks. This class is not thread safe. Use one "
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/repackage/com/nothome/delta/Delta.html"
sourceType: javadoc
---

# Delta

## Class signature

```java
public class Delta extends java.lang.Object
```

## Constructors

- `public Delta()`

## Methods

- `public void setChunkSize(int size)`
- `public void compute(byte[] source, byte[] target, java.io.OutputStream output) throws java.io.IOException`
- `public byte[] compute(byte[] source, byte[] target) throws java.io.IOException`
- `public void compute(byte[] sourceBytes, java.io.InputStream inputStream, DiffWriter diffWriter) throws java.io.IOException`
- `public void compute(java.io.File sourceFile, java.io.File targetFile, DiffWriter output) throws java.io.IOException`
- `public void compute( SeekableSource seekSource, java.io.InputStream targetIS, DiffWriter output) throws java.io.IOException`
- `public static void main(java.lang.String[] argv) throws java.lang.Exception`

## Description

Class for computing deltas against a source. The source file is read by blocks and a hash is computed per block. Then the target is scanned for matching blocks. This class is not thread safe. Use one 
