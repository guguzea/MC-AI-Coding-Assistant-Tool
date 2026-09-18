# Repository

## Class signature

```java
public class Repository extends java.lang.Object
```

## Constructors

- `protected Repository(java.io.File root) throws java.io.IOException`
- `protected Repository(java.io.File root, java.lang.String name)`

## Methods

- `public static Repository create(java.io.File root) throws java.io.IOException`
- `public static Repository create(java.io.File root, java.lang.String name)`
- `public static Repository replace(java.io.File root, java.lang.String name)`
- `public static Repository get(java.lang.String name)`
- `public static Artifact resolveAll( Artifact artifact)`
- `public int hashCode()`
- `public boolean equals(java.lang.Object o)`
- `public Artifact resolve( Artifact artifact)`
- `public java.io.File getFile(java.lang.String path)`
- `public java.io.File archive( Artifact artifact, java.io.File file, byte[] manifest)`
- `public void filterLegacy(java.util.List<java.io.File> list)`