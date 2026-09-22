# DebugDiffWriter

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.DebugDiffWriter

## Class signature

```java
public class DebugDiffWriter extends java.lang.Object implements DiffWriter
```

## Constructors

- `DebugDiffWriter()`

## Methods

- `void addCopy(long offset, int length)` — Add a GDIFF copy instruction.
- `void addData(byte b)` — Add a GDIFF data instruction.
- `void close()` — Closes this stream.
- `void flush()` — Flushes to output, e.g. any data added.