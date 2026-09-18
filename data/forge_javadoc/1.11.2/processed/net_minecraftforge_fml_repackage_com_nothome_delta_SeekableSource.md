# SeekableSource

## Class signature

```java
public interface SeekableSource extends java.io.Closeable
```

## Methods

- `void seek(long pos) throws java.io.IOException`
- `int read(java.nio.ByteBuffer bb) throws java.io.IOException`

## Description

For sources of random-access data, such as RandomAccessFile .