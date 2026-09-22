---
title: "ByteBufferSeekableSource"
description: "public class ByteBufferSeekableSource extends java.lang.Object implements SeekableSource"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/repackage/com/nothome/delta/ByteBufferSeekableSource.html"
sourceType: javadoc
---

# ByteBufferSeekableSource

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.ByteBufferSeekableSource

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
