# Checksum

**Inheritance:** java.lang.Object → net.minecraftforge.fml.repackage.com.nothome.delta.Checksum

## Class signature

```java
public class Checksum extends java.lang.Object
```

## Constructors

- `Checksum(SeekableSource source, int chunkSize)`

## Methods

- `int findChecksumIndex(long hashf)` — Finds the index of a checksum.
- `static char[] getSingleHash()` — 256 random hash values.
- `static long incrementChecksum(long checksum, byte out, byte in, int chunkSize)` — Increments a checksum.
- `static long queryChecksum(java.nio.ByteBuffer bb, int len)` — Finds the checksum computed from the buffer.
- `java.lang.String toString()` — Returns a debug String .