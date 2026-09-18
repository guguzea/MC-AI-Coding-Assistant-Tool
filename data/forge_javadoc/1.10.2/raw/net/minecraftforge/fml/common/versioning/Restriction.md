---
title: "Restriction"
description: "Describes a restriction in versioning."
package: "net/minecraftforge/fml/common/versioning"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/versioning/Restriction.html"
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
- `public java.lang.String toStringFriendly()`

## Description

Describes a restriction in versioning.
