---
title: "Artifact"
description: "public class Artifact extends java.lang.Object implements java.lang.Comparable< Artifact >"
package: "net/minecraftforge/fml/relauncher/libraries"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/relauncher/libraries/Artifact.html"
sourceType: javadoc
---

# Artifact

## Class signature

```java
public class Artifact extends java.lang.Object implements java.lang.Comparable< Artifact >
```

## Constructors

- `public Artifact( Repository repo, java.lang.String value, java.lang.String timestamp)`
- `public Artifact( Artifact other, Repository repo, java.lang.String timestamp)`

## Methods

- `public java.lang.String toString()`
- `public int hashCode()`
- `public java.lang.String getFilename()`
- `public java.lang.String getFolder()`
- `public java.lang.String getPath()`
- `public java.io.File getFile()`
- `public java.io.File getSnapshotMeta()`
- `public boolean isSnapshot()`
- `public java.lang.String getTimestamp()`
- `public ComparableVersion getVersion()`
- `public Repository getRepository()`
- `public boolean matchesID( Artifact o)`
- `public int compareVersion( Artifact o)`
- `public int compareTo( Artifact o)`
