# PlayerChunkMap

**Inheritance:** java.lang.Object → net.minecraft.server.management.PlayerChunkMap

## Class signature

```java
public class PlayerChunkMap extends java.lang.Object
```

## Constructors

- `PlayerChunkMap(WorldServer serverWorld)`

## Methods

- `void addEntry(PlayerChunkMapEntry entry)`
- `void addPlayer(EntityPlayerMP player)`
- `boolean contains(int chunkX, int chunkZ)`
- `java.util.Iterator<Chunk> getChunkIterator()`
- `PlayerChunkMapEntry getEntry(int x, int z)`
- `static int getFurthestViewableBlock(int distance)`
- `WorldServer getWorldServer()`
- `boolean isPlayerWatchingChunk(EntityPlayerMP player, int chunkX, int chunkZ)`
- `void markBlockForUpdate(BlockPos pos)`
- `void removeEntry(PlayerChunkMapEntry entry)`
- `void removePlayer(EntityPlayerMP player)`
- `void setPlayerViewRadius(int radius)`
- `void tick()`
- `void updateMountedMovingPlayer(EntityPlayerMP player)`