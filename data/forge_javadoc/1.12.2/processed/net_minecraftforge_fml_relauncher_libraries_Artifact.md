# Artifact

**Inheritance:** java.lang.Object → net.minecraftforge.fml.relauncher.libraries.Artifact

## Class signature

```java
public class Artifact extends java.lang.Object implements java.lang.Comparable<Artifact>
```

## Constructors

- `Artifact(Artifact other, Repository repo, java.lang.String timestamp)`
- `Artifact(Repository repo, java.lang.String value, java.lang.String timestamp)`

## Methods

- `int compareTo(Artifact o)`
- `int compareVersion(Artifact o)`
- `java.io.File getFile()`
- `java.lang.String getFilename()`
- `java.lang.String getFolder()`
- `java.lang.String getPath()`
- `Repository getRepository()`
- `java.io.File getSnapshotMeta()`
- `java.lang.String getTimestamp()`
- `ComparableVersion getVersion()`
- `int hashCode()`
- `boolean isSnapshot()`
- `boolean matchesID(Artifact o)`
- `java.lang.String toString()`