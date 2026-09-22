---
title: "Delta"
description: "public class Delta extends java.lang.Object"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/repackage/com/nothome/delta/Delta.html"
sourceType: javadoc
---

# Delta

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.Delta

## Class signature

```java
public class Delta extends java.lang.Object
```

## Constructors

- `Delta()`

## Methods

- `byte[] compute(byte[] source, byte[] target)` — Compares the source bytes with target bytes, returning output.
- `void compute(byte[] source, byte[] target, java.io.OutputStream output)` — Compares the source bytes with target bytes, writing to output.
- `void compute(byte[] sourceBytes, java.io.InputStream inputStream, DiffWriter diffWriter)` — Compares the source bytes with target input, writing to output.
- `void compute(java.io.File sourceFile, java.io.File targetFile, DiffWriter output)` — Compares the source file with a target file, writing to output.
- `void compute(SeekableSource seekSource, java.io.InputStream targetIS, DiffWriter output)` — Compares the source with a target, writing to output.
- `static void main(java.lang.String[] argv)` — Creates a patch using file names.
- `void setChunkSize(int size)` — Sets the chunk size used.

## Fields

- `static int DEFAULT_CHUNK_SIZE` — Default size of 16.
