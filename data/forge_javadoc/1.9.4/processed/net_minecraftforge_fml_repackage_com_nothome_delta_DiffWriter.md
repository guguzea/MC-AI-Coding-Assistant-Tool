# DiffWriter

## Class signature

```java
public interface DiffWriter extends java.io.Closeable
```

## Methods

- `void addCopy(long offset, int length)` — Add a GDIFF copy instruction.
- `void addData(byte b)` — Add a GDIFF data instruction.
- `void close()` — Closes this stream.
- `void flush()` — Flushes to output, e.g. any data added.