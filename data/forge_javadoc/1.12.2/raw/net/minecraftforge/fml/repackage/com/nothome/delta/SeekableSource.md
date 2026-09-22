---
title: "SeekableSource"
description: "public interface SeekableSource extends java.io.Closeable"
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/repackage/com/nothome/delta/SeekableSource.html"
sourceType: javadoc
---

# SeekableSource

## Class signature

```java
public interface SeekableSource extends java.io.Closeable
```

## Methods

- `int read(java.nio.ByteBuffer bb)` — Reads up to Buffer.remaining() bytes from the source, returning the number of bytes read, or -1 if no bytes were read and EOF was reached.
- `void seek(long pos)` — Sets the position for the next read(ByteBuffer) .
