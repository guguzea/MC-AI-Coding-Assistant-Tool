---
title: "ChunkProviderClient"
description: "public class ChunkProviderClient extends java.lang.Object implements IChunkProvider"
package: "net/minecraft/client/multiplayer"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/multiplayer/ChunkProviderClient.html"
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
- `public boolean tick()`
- `public java.lang.String makeString()`
- `public boolean isChunkGeneratedAt(int p_191062_1_, int p_191062_2_)`
