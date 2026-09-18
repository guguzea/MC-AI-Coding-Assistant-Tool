# ComparableVersion

## Class signature

```java
public class ComparableVersion extends java.lang.Object implements java.lang.Comparable< ComparableVersion >
```

## Constructors

- `public ComparableVersion(java.lang.String version)`

## Methods

- `public final void parseVersion(java.lang.String version)`
- `public int compareTo( ComparableVersion o)`
- `public java.lang.String toString()`
- `public boolean equals(java.lang.Object o)`
- `public int hashCode()`

## Description

Generic implementation of version comparison. Features: mixing of ' - ' (dash) and ' . ' (dot) separators, transition between characters and digits also constitutes a separator: 1.0alpha1 => [1, 0, al