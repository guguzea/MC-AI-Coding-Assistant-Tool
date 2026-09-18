---
title: "Checksum"
description: "Checksum computation class."
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/repackage/com/nothome/delta/Checksum.html"
sourceType: javadoc
---

# Checksum

## Class signature

```java
public class Checksum extends java.lang.Object
```

## Constructors

- `public Checksum( SeekableSource source, int chunkSize) throws java.io.IOException`

## Methods

- `public static long queryChecksum(java.nio.ByteBuffer bb, int len)`
- `public static long incrementChecksum(long checksum, byte out, byte in, int chunkSize)`
- `public static char[] getSingleHash()`
- `public int findChecksumIndex(long hashf)`
- `public java.lang.String toString()`

## Description

Checksum computation class.
