---
title: "VersionRange"
description: "Construct a version range from a specification."
package: "net/minecraftforge/fml/common/versioning"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/versioning/VersionRange.html"
sourceType: javadoc
---

# VersionRange

## Class signature

```java
public class VersionRange extends java.lang.Object
```

## Methods

- `public ArtifactVersion getRecommendedVersion()`
- `public java.util.List< Restriction > getRestrictions()`
- `public VersionRange cloneOf()`
- `public static VersionRange newRange( ArtifactVersion version, java.util.List< Restriction > restrictions)`
- `public static VersionRange createFromVersionSpec(@Nullable java.lang.String spec) throws InvalidVersionSpecificationException`
- `public static VersionRange createFromVersion(java.lang.String version, ArtifactVersion existing)`
- `public VersionRange restrict( VersionRange restriction)`
- `public java.lang.String toString()`
- `public java.lang.String toStringFriendly()`
- `public ArtifactVersion matchVersion(java.util.List< ArtifactVersion > versions)`
- `public boolean containsVersion( ArtifactVersion version)`
- `public boolean hasRestrictions()`
- `public boolean equals(java.lang.Object obj)`
- `public int hashCode()`
- `public boolean isUnboundedAbove()`
- `public java.lang.String getLowerBoundString()`

## Description

Construct a version range from a specification.
