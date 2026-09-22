---
title: "Restriction"
description: "public class Restriction extends java.lang.Object"
package: "net/minecraftforge/fml/common/versioning"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/versioning/Restriction.html"
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

## Fields

- `static Restriction EVERYTHING`
