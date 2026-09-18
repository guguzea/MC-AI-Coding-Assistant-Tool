---
title: "PlayerManager"
description: "Adds an EntityPlayerMP to the PlayerManager and to all player instances within player visibility"
package: "net/minecraft/server/management"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/server/management/PlayerManager.html"
sourceType: javadoc
---

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
