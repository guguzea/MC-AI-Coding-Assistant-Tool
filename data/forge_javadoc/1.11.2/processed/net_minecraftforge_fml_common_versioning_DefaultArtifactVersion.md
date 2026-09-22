# DefaultArtifactVersion

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.versioning.DefaultArtifactVersion

## Class signature

```java
public class DefaultArtifactVersion extends java.lang.Object implements ArtifactVersion
```

## Constructors

- `DefaultArtifactVersion(java.lang.String versionNumber)`
- `DefaultArtifactVersion(java.lang.String string, boolean unbounded)`
- `DefaultArtifactVersion(java.lang.String label, java.lang.String version)`
- `DefaultArtifactVersion(java.lang.String label, VersionRange range)`

## Methods

- `int compareTo(ArtifactVersion o)`
- `boolean containsVersion(ArtifactVersion source)`
- `boolean equals(java.lang.Object obj)`
- `java.lang.String getLabel()`
- `VersionRange getRange()`
- `java.lang.String getRangeString()`
- `java.lang.String getVersionString()`
- `java.lang.String toString()`