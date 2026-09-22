# RegionFileCache

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `RegionFileCache()`

## Methods

- `static boolean chunkExists(java.io.File worldDir, int chunkX, int chunkZ)`
- `static void clearRegionFileReferences()`
- `static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `static RegionFile getRegionFileIfExists(java.io.File worldDir, int chunkX, int chunkZ)`