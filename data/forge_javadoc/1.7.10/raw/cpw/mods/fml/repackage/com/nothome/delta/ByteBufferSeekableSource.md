---
title: "ByteBufferSeekableSource"
description: "Wraps a byte buffer as a source"
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/ByteBufferSeekableSource.html"
sourceType: javadoc
---

# ByteBufferSeekableSource

## Class signature

```java
public class ByteBufferSeekableSource extends java.lang.Object implements SeekableSource
```

## Constructors

- `public ByteBufferSeekableSource(byte[] source)`
- `public ByteBufferSeekableSource(java.nio.ByteBuffer bb)`

## Methods

- `public void seek(long pos) throws java.io.IOException`
- `public int read(java.nio.ByteBuffer dest) throws java.io.IOException`
- `public void close() throws java.io.IOException`
- `public java.lang.String toString()`

## Description

Wraps a byte buffer as a source
