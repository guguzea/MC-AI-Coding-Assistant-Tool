# VersionParser

## Class signature

```java
public class VersionParser extends java.lang.Object
```

## Constructors

- `public VersionParser()`

## Methods

- `public static ArtifactVersion parseVersionReference(java.lang.String labelledRef)`
- `public static boolean satisfies( ArtifactVersion target, ArtifactVersion source)`
- `public static VersionRange parseRange(java.lang.String range)`

## Description

Parses version strings according to the specification here: http://docs.codehaus.org/display/MAVEN/Versioning and allows for comparison of versions based on that document. Bounded version specificatio