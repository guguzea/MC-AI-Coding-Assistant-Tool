# DiffWriter

## Class signature

```java
public interface DiffWriter extends java.io.Closeable
```

## Methods

- `void addCopy(long offset, int length) throws java.io.IOException`
- `void addData(byte b) throws java.io.IOException`
- `void flush() throws java.io.IOException`
- `void close() throws java.io.IOException`

## Description

Interface for DIFF writers.