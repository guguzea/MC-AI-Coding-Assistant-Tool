---
title: "Restriction"
description: "public class Restriction extends java.lang.Object"
package: "net/minecraftforge/fml/common/versioning"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/versioning/Restriction.html"
sourceType: javadoc
---

# Restriction

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.versioning.Restriction

## Class signature

```java
public class Restriction extends java.lang.Object
```

## Constructors

- `Restriction(ArtifactVersion lowerBound, boolean lowerBoundInclusive, ArtifactVersion upperBound, boolean upperBoundInclusive)`

## Methods

- `boolean containsVersion(ArtifactVersion version)`
- `boolean equals(java.lang.Object other)`
- `ArtifactVersion getLowerBound()`
- `ArtifactVersion getUpperBound()`
- `int hashCode()`
- `boolean isLowerBoundInclusive()`
- `boolean isUpperBoundInclusive()`
- `java.lang.String toString()`
- `java.lang.String toStringFriendly()`

## Fields

- `static Restriction EVERYTHING`
