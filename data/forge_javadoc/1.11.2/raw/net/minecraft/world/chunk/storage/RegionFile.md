---
title: "RegionFile"
description: "public class RegionFile extends java.lang.Object"
package: "net/minecraft/world/chunk/storage"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/world/chunk/storage/RegionFile.html"
sourceType: javadoc
---

# RegionFile

## Class signature

```java
public class RegionFile extends java.lang.Object
```

## Constructors

- `public RegionFile(java.io.File fileNameIn)`

## Methods

- `public boolean chunkExists(int x, int z)`
- `@Nullable public java.io.DataInputStream getChunkDataInputStream(int x, int z)`
- `@Nullable public java.io.DataOutputStream getChunkDataOutputStream(int x, int z)`
- `protected void write(int x, int z, byte[] data, int length)`
- `public boolean isChunkSaved(int x, int z)`
- `public void close() throws java.io.IOException`
