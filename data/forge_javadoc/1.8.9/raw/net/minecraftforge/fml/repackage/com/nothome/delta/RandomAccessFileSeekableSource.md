---
title: "RandomAccessFileSeekableSource"
description: "public class RandomAccessFileSeekableSource extends java.lang.Object implements SeekableSource"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/repackage/com/nothome/delta/RandomAccessFileSeekableSource.html"
sourceType: javadoc
---

# RandomAccessFileSeekableSource

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.RandomAccessFileSeekableSource

## Class signature

```java
public class RandomAccessFileSeekableSource extends java.lang.Object implements SeekableSource
```

## Constructors

- `RandomAccessFileSeekableSource(java.io.RandomAccessFile raf)`

## Methods

- `void close()`
- `long length()`
- `int read(byte[] b, int off, int len)`
- `int read(java.nio.ByteBuffer bb)` — Reads up to Buffer.remaining() bytes from the source, returning the number of bytes read, or -1 if no bytes were read and EOF was reached.
- `void seek(long pos)` — Sets the position for the next SeekableSource.read(ByteBuffer) .
