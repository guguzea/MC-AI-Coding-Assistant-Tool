# RegionFile

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.RegionFile

## Class signature

```java
public class RegionFile extends java.lang.Object
```

## Constructors

- `RegionFile(java.io.File fileNameIn)`

## Methods

- `boolean chunkExists(int x, int z)`
- `void close()`
- `java.io.DataInputStream getChunkDataInputStream(int x, int z)`
- `java.io.DataOutputStream getChunkDataOutputStream(int x, int z)`
- `boolean isChunkSaved(int x, int z)`
- `protected void write(int x, int z, byte[] data, int length)`