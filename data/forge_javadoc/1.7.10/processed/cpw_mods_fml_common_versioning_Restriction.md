# Restriction

**Inheritance:** java.lang.Object → cpw.mods.fml.common.versioning.Restriction

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