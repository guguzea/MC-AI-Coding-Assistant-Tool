---
title: "ByteBufferSeekableSource"
description: "public class ByteBufferSeekableSource extends java.lang.Object implements SeekableSource"
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/ByteBufferSeekableSource.html"
sourceType: javadoc
---

# ByteBufferSeekableSource

**Inheritance:** java.lang.Object → cpw.mods.fml.repackage.com.nothome.delta.ByteBufferSeekableSource

## Class signature

```java
public class ByteBufferSeekableSource extends java.lang.Object implements SeekableSource
```

## Constructors

- `ByteBufferSeekableSource(byte[] source)`
- `ByteBufferSeekableSource(java.nio.ByteBuffer bb)`

## Methods

- `void close()`
- `int read(java.nio.ByteBuffer dest)` — Reads up to Buffer.remaining() bytes from the source, returning the number of bytes read, or -1 if no bytes were read and EOF was reached.
- `void seek(long pos)` — Sets the position for the next SeekableSource.read(ByteBuffer) .
- `java.lang.String toString()` — Returns a debug String .
