---
title: "Restriction"
description: "Describes a restriction in versioning."
package: "net/minecraftforge/fml/common/versioning"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/versioning/Restriction.html"
sourceType: javadoc
---

# Restriction

## Class signature

```java
public class Restriction extends java.lang.Object
```

## Constructors

- `public Restriction(@Nullable ArtifactVersion lowerBound, boolean lowerBoundInclusive, @Nullable ArtifactVersion upperBound, boolean upperBoundInclusive)`

## Methods

- `@Nullable public ArtifactVersion getLowerBound()`
- `public boolean isLowerBoundInclusive()`
- `@Nullable public ArtifactVersion getUpperBound()`
- `public boolean isUpperBoundInclusive()`
- `public boolean containsVersion( ArtifactVersion version)`
- `public int hashCode()`
- `public boolean equals(java.lang.Object other)`
- `public java.lang.String toString()`
- `public java.lang.String toStringFriendly()`

## Description

Describes a restriction in versioning.
