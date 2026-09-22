# RegionFileCache

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `RegionFileCache()`

## Methods

- `static void clearRegionFileReferences()` — clears region file references
- `static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)` — Returns an input stream for the specified chunk.
- `static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)` — Returns an output stream for the specified chunk.