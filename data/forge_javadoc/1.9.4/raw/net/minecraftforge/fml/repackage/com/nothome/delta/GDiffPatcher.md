---
title: "GDiffPatcher"
description: "This class patches an input file with a GDIFF patch file. The patch file follows the GDIFF file specification available at http://www.w3.org/TR/NOTE-gdiff-19970901.html ."
package: "net/minecraftforge/fml/repackage/com/nothome/delta"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/repackage/com/nothome/delta/GDiffPatcher.html"
sourceType: javadoc
---

# GDiffPatcher

## Class signature

```java
public class GDiffPatcher extends java.lang.Object
```

## Constructors

- `public GDiffPatcher()`

## Methods

- `public void patch(java.io.File sourceFile, java.io.File patchFile, java.io.File outputFile) throws java.io.IOException`
- `public void patch(byte[] source, java.io.InputStream patch, java.io.OutputStream output) throws java.io.IOException`
- `public byte[] patch(byte[] source, byte[] patch) throws java.io.IOException`
- `public void patch( SeekableSource source, java.io.InputStream patch, java.io.OutputStream out) throws java.io.IOException`
- `public static void main(java.lang.String[] argv)`

## Description

This class patches an input file with a GDIFF patch file. The patch file follows the GDIFF file specification available at http://www.w3.org/TR/NOTE-gdiff-19970901.html .
