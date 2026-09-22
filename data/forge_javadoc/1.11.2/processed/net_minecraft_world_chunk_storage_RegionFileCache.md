# RegionFileCache

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `RegionFileCache()`

## Methods

- `static boolean chunkExists(java.io.File p_191064_0_, int p_191064_1_, int p_191064_2_)`
- `static void clearRegionFileReferences()`
- `static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `static RegionFile getRegionFileIfExists(java.io.File p_191065_0_, int p_191065_1_, int p_191065_2_)`