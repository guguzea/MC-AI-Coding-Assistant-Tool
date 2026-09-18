# RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `public RegionFileCache()`

## Methods

- `public static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static RegionFile getRegionFileIfExists(java.io.File p_191065_0_, int p_191065_1_, int p_191065_2_)`
- `public static void clearRegionFileReferences()`
- `public static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static boolean chunkExists(java.io.File p_191064_0_, int p_191064_1_, int p_191064_2_)`