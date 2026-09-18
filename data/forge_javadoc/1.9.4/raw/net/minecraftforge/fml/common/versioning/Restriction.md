---
title: "Restriction"
description: "Describes a restriction in versioning."
package: "net/minecraftforge/fml/common/versioning"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/versioning/Restriction.html"
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
