# PlayerManager

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerManager

## Class signature

```java
public class PlayerManager extends java.lang.Object
```

## Constructors

- `PlayerManager(WorldServer serverWorld)`

## Methods

- `void addPlayer(EntityPlayerMP player)` — Adds an EntityPlayerMP to the PlayerManager and to all player instances within player visibility
- `void filterChunkLoadQueue(EntityPlayerMP player)` — Removes all chunks from the given player's chunk load queue that are not in viewing range of the player.
- `static int getFurthestViewableBlock(int distance)` — Get the furthest viewable block given player's view distance
- `WorldServer getWorldServer()` — Returns the WorldServer associated with this PlayerManager
- `boolean hasPlayerInstance(int chunkX, int chunkZ)`
- `boolean isPlayerWatchingChunk(EntityPlayerMP player, int chunkX, int chunkZ)`
- `void markBlockForUpdate(BlockPos pos)`
- `void removePlayer(EntityPlayerMP player)` — Removes an EntityPlayerMP from the PlayerManager.
- `void setPlayerViewRadius(int radius)`
- `void updateMountedMovingPlayer(EntityPlayerMP player)` — update chunks around a player being moved by server logic (e.g. cart, boat)
- `void updatePlayerInstances()` — updates all the player instances that need to be updated