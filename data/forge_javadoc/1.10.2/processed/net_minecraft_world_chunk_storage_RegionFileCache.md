# RegionFileCache

## Class signature

```java
public class RegionFileCache extends java.lang.Object
```

## Constructors

- `public RegionFileCache()`

## Methods

- `public static RegionFile createOrLoadRegionFile(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static void clearRegionFileReferences()`
- `public static java.io.DataInputStream getChunkInputStream(java.io.File worldDir, int chunkX, int chunkZ)`
- `public static java.io.DataOutputStream getChunkOutputStream(java.io.File worldDir, int chunkX, int chunkZ)`