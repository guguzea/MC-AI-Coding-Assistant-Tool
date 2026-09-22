---
title: "GDiffPatcher"
description: "public class GDiffPatcher extends java.lang.Object"
package: "cpw/mods/fml/repackage/com/nothome/delta"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/repackage/com/nothome/delta/GDiffPatcher.html"
sourceType: javadoc
---

# GDiffPatcher

**Inheritance:** java.lang.Object → cpw.mods.fml.repackage.com.nothome.delta.GDiffPatcher

## Class signature

```java
public class GDiffPatcher extends java.lang.Object
```

## Constructors

- `GDiffPatcher()`

## Methods

- `static void main(java.lang.String[] argv)` — Simple command line tool to patch a file.
- `byte[] patch(byte[] source, byte[] patch)` — Patches in memory, returning the patch result.
- `void patch(byte[] source, java.io.InputStream patch, java.io.OutputStream output)` — Patches to an output stream.
- `void patch(java.io.File sourceFile, java.io.File patchFile, java.io.File outputFile)` — Patches to an output file.
- `void patch(SeekableSource source, java.io.InputStream patch, java.io.OutputStream out)` — Patches to an output stream.
