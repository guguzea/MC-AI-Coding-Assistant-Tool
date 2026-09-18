# DebugDiffWriter

## Class signature

```java
public class DebugDiffWriter extends java.lang.Object implements DiffWriter
```

## Constructors

- `public DebugDiffWriter()`

## Methods

- `public void addCopy(long offset, int length) throws java.io.IOException`
- `public void addData(byte b) throws java.io.IOException`
- `public void flush() throws java.io.IOException`
- `public void close() throws java.io.IOException`

## Description

For debugging patch generation.