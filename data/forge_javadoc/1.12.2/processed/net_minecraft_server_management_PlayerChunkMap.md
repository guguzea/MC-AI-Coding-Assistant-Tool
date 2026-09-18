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
- `public PlayerChunkMapEntry getEntry(int x, int z)`
- `public void markBlockForUpdate( BlockPos pos)`
- `public void addPlayer( EntityPlayerMP player)`
- `public void removePlayer( EntityPlayerMP player)`
- `public void updateMovingPlayer( EntityPlayerMP player)`
- `public boolean isPlayerWatchingChunk( EntityPlayerMP player, int chunkX, int chunkZ)`
- `public void setPlayerViewRadius(int radius)`
- `public static int getFurthestViewableBlock(int distance)`
- `public void entryChanged( PlayerChunkMapEntry entry)`
- `public void removeEntry( PlayerChunkMapEntry entry)`