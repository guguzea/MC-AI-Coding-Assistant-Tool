# DefaultArtifactVersion

## Class signature

```java
public class DefaultArtifactVersion extends java.lang.Object implements ArtifactVersion
```

## Constructors

- `public DefaultArtifactVersion(java.lang.String versionNumber)`
- `public DefaultArtifactVersion(java.lang.String label, VersionRange range)`
- `public DefaultArtifactVersion(java.lang.String label, java.lang.String version)`
- `public DefaultArtifactVersion(java.lang.String string, boolean unbounded)`

## Methods

- `public boolean equals(java.lang.Object obj)`
- `public int compareTo( ArtifactVersion o)`
- `public java.lang.String getLabel()`
- `public boolean containsVersion( ArtifactVersion source)`
- `public java.lang.String getVersionString()`
- `public java.lang.String getRangeString()`
- `public java.lang.String toString()`
- `public VersionRange getRange()`