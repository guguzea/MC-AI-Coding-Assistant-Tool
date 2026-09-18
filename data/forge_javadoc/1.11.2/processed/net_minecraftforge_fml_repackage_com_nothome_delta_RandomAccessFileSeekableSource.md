# RandomAccessFileSeekableSource

## Class signature

```java
public class RandomAccessFileSeekableSource extends java.lang.Object implements SeekableSource
```

## Constructors

- `public RandomAccessFileSeekableSource(java.io.RandomAccessFile raf)`

## Methods

- `public void seek(long pos) throws java.io.IOException`
- `public int read(byte[] b, int off, int len) throws java.io.IOException`
- `public long length() throws java.io.IOException`
- `public void close() throws java.io.IOException`
- `public int read(java.nio.ByteBuffer bb) throws java.io.IOException`

## Description

Wraps a random access file.