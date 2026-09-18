---
title: "PlayerChunkMap"
description: "public class PlayerChunkMap extends java.lang.Object"
package: "net/minecraft/server/management"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraft/server/management/PlayerChunkMap.html"
sourceType: javadoc
---

# PlayerChunkMap

## Class signature

```java
public class PlayerChunkMap extends java.lang.Object
```

## Constructors

- `public PlayerChunkMap( WorldServer serverWorld)`

## Methods

- `public WorldServer getWorldServer()`
- `public java.util.Iterator< Chunk > getChunkIterator()`
- `public void tick()`
- `public boolean contains(int chunkX, int chunkZ)`
- `@Nullable public PlayerChunkMapEntry getEntry(int x, int z)`
- `public void markBlockForUpdate( BlockPos pos)`
- `public void addPlayer( EntityPlayerMP player)`
- `public void removePlayer( EntityPlayerMP player)`
- `public void updateMountedMovingPlayer( EntityPlayerMP player)`
- `public boolean isPlayerWatchingChunk( EntityPlayerMP player, int chunkX, int chunkZ)`
- `public void setPlayerViewRadius(int radius)`
- `public static int getFurthestViewableBlock(int distance)`
- `public void addEntry( PlayerChunkMapEntry entry)`
- `public void removeEntry( PlayerChunkMapEntry entry)`
