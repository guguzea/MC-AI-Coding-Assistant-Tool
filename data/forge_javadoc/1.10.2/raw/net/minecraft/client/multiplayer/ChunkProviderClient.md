---
title: "ChunkProviderClient"
description: "public class ChunkProviderClient extends java.lang.Object implements IChunkProvider"
package: "net/minecraft/client/multiplayer"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/multiplayer/ChunkProviderClient.html"
sourceType: javadoc
---

# ChunkProviderClient

## Class signature

```java
public class ChunkProviderClient extends java.lang.Object implements IChunkProvider
```

## Constructors

- `public ChunkProviderClient( World worldIn)`

## Methods

- `public void unloadChunk(int x, int z)`
- `@Nullable public Chunk getLoadedChunk(int x, int z)`
- `public Chunk loadChunk(int chunkX, int chunkZ)`
- `public Chunk provideChunk(int x, int z)`
- `public boolean unloadQueuedChunks()`
- `public java.lang.String makeString()`
