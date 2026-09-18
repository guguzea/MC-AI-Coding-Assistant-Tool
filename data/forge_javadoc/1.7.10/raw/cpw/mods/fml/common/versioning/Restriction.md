---
title: "Restriction"
description: "Describes a restriction in versioning."
package: "cpw/mods/fml/common/versioning"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/versioning/Restriction.html"
sourceType: javadoc
---

# Restriction

## Class signature

```java
public class Restriction extends java.lang.Object
```

## Constructors

- `public Restriction( ArtifactVersion lowerBound, boolean lowerBoundInclusive, ArtifactVersion upperBound, boolean upperBoundInclusive)`

## Methods

- `public ArtifactVersion getLowerBound()`
- `public boolean isLowerBoundInclusive()`
- `public ArtifactVersion getUpperBound()`
- `public boolean isUpperBoundInclusive()`
- `public boolean containsVersion( ArtifactVersion version)`
- `public int hashCode()`
- `public boolean equals(java.lang.Object other)`
- `public java.lang.String toString()`

## Description

Describes a restriction in versioning.
