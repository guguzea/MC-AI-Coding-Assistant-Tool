---
title: "RandomAccessFileSeekableSource"
description: "public class RandomAccessFileSeekableSource extends java.lang.Object implements SeekableSource"
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/RandomAccessFileSeekableSource.html"
sourceType: javadoc
---

# RandomAccessFileSeekableSource

**Inheritance:** java.lang.Object → cpw.mods.fml.repackage.com.nothome.delta.RandomAccessFileSeekableSource

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
