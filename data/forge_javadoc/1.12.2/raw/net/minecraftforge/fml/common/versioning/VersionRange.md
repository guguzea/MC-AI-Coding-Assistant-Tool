---
title: "VersionRange"
description: "public class VersionRange extends java.lang.Object"
package: "net/minecraftforge/fml/common/versioning"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/versioning/VersionRange.html"
sourceType: javadoc
---

# VersionRange

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.versioning.VersionRange

## Class signature

```java
public class VersionRange extends java.lang.Object
```

## Methods

- `VersionRange cloneOf()`
- `boolean containsVersion(ArtifactVersion version)`
- `static VersionRange createFromVersion(java.lang.String version, ArtifactVersion existing)`
- `static VersionRange createFromVersionSpec(java.lang.String spec)` — Create a version range from a string representation Some spec examples are 1.0 Version 1.0 [1.0,2.0) Versions 1.0 (included) to 2.0 (not included) [1.0,2.0] Versions 1.0 to 2.0 (both included) [1.5,) Versions 1.5 and higher (,1.0],[1.2,) Versions up to 1.0 (included) and 1.2 or higher
- `boolean equals(java.lang.Object obj)`
- `java.lang.String getLowerBoundString()`
- `ArtifactVersion getRecommendedVersion()`
- `java.util.List<Restriction> getRestrictions()`
- `int hashCode()`
- `boolean hasRestrictions()`
- `boolean isUnboundedAbove()`
- `ArtifactVersion matchVersion(java.util.List<ArtifactVersion> versions)`
- `static VersionRange newRange(ArtifactVersion version, java.util.List<Restriction> restrictions)` — Factory method, for custom versioning schemes
- `VersionRange restrict(VersionRange restriction)` — Creates and returns a new VersionRange that is a restriction of this version range and the specified version range.
- `java.lang.String toString()`
- `java.lang.String toStringFriendly()`
