---
title: "SnapshotJson"
description: "public class SnapshotJson extends java.lang.Object implements java.lang.Comparable<SnapshotJson>"
package: "net/minecraftforge/fml/relauncher/libraries"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/libraries/SnapshotJson.html"
sourceType: javadoc
---

# SnapshotJson

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.libraries.SnapshotJson

## Class signature

```java
public class SnapshotJson extends java.lang.Object implements java.lang.Comparable<SnapshotJson>
```

## Constructors

- `SnapshotJson()`

## Methods

- `void add(SnapshotJson.Entry data)`
- `int compareTo(SnapshotJson o)`
- `static SnapshotJson create(java.io.File target)`
- `java.lang.String getLatest()`
- `void merge(SnapshotJson o)`
- `boolean remove(java.lang.String timestamp)`
- `java.lang.String updateLatest()`
- `void write(java.io.File target)`

## Fields

- `static java.lang.String META_JSON_FILE`
- `static java.text.DateFormat TIMESTAMP`
