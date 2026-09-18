---
title: "GDiffWriter"
description: "Outputs a diff following the GDIFF file specification available at http://www.w3.org/TR/NOTE-gdiff-19970901.html."
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/GDiffWriter.html"
sourceType: javadoc
---

# GDiffWriter

## Class signature

```java
public class GDiffWriter extends java.lang.Object implements DiffWriter
```

## Constructors

- `public GDiffWriter(java.io.DataOutputStream os) throws java.io.IOException`
- `public GDiffWriter(java.io.OutputStream output) throws java.io.IOException`

## Methods

- `public void addCopy(long offset, int length) throws java.io.IOException`
- `public void addData(byte b) throws java.io.IOException`
- `public void flush() throws java.io.IOException`
- `public void close() throws java.io.IOException`

## Description

Outputs a diff following the GDIFF file specification available at http://www.w3.org/TR/NOTE-gdiff-19970901.html.
