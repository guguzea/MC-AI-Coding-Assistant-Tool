# PlayerManager

## Class signature

```java
public class PlayerManager extends java.lang.Object
```

## Constructors

- `public PlayerManager( WorldServer serverWorld)`

## Methods

- `public WorldServer getWorldServer()`
- `public void updatePlayerInstances()`
- `public boolean hasPlayerInstance(int chunkX, int chunkZ)`
- `public void markBlockForUpdate( BlockPos pos)`
- `public void addPlayer( EntityPlayerMP player)`
- `public void filterChunkLoadQueue( EntityPlayerMP player)`
- `public void removePlayer( EntityPlayerMP player)`
- `public void updateMountedMovingPlayer( EntityPlayerMP player)`
- `public boolean isPlayerWatchingChunk( EntityPlayerMP player, int chunkX, int chunkZ)`
- `public void setPlayerViewRadius(int radius)`
- `public static int getFurthestViewableBlock(int distance)`

## Description

Adds an EntityPlayerMP to the PlayerManager and to all player instances within player visibility