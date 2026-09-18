# SnapshotJson

## Class signature

```java
public class SnapshotJson extends java.lang.Object implements java.lang.Comparable< SnapshotJson >
```

## Constructors

- `public SnapshotJson()`

## Methods

- `public static SnapshotJson create(java.io.File target)`
- `public java.lang.String getLatest()`
- `public void add( SnapshotJson.Entry data)`
- `public void merge( SnapshotJson o)`
- `public boolean remove(java.lang.String timestamp)`
- `public java.lang.String updateLatest()`
- `public void write(java.io.File target) throws java.io.IOException`
- `public int compareTo( SnapshotJson o)`

## Description

This is different from the standard maven snapshot metadata. Because none of that data is exposed to us as a user of gradle/maven/whatever. So we JUST use the timestamp. { "latest": "yyyyMMdd.hhmmss",