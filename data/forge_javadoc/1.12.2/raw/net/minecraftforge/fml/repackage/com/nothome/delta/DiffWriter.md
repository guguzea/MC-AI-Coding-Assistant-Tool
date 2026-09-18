---
title: "DiffWriter"
description: "Interface for DIFF writers."
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/repackage/com/nothome/delta/DiffWriter.html"
sourceType: javadoc
---

# DiffWriter

## Class signature

```java
public interface DiffWriter extends java.io.Closeable
```

## Methods

- `void addCopy(long offset, int length) throws java.io.IOException`
- `void addData(byte b) throws java.io.IOException`
- `void flush() throws java.io.IOException`
- `void close() throws java.io.IOException`

## Description

Interface for DIFF writers.
