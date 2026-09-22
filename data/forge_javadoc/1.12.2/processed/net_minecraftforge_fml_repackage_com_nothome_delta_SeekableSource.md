# SeekableSource

## Class signature

```java
public interface SeekableSource extends java.io.Closeable
```

## Methods

- `int read(java.nio.ByteBuffer bb)` — Reads up to Buffer.remaining() bytes from the source, returning the number of bytes read, or -1 if no bytes were read and EOF was reached.
- `void seek(long pos)` — Sets the position for the next read(ByteBuffer) .