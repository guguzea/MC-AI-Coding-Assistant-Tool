# PlayerChunkMapEntry

## Class signature

```java
public class PlayerChunkMapEntry extends java.lang.Object
```

## Constructors

- `public PlayerChunkMapEntry( PlayerChunkMap mapIn, int chunkX, int chunkZ)`

## Methods

- `public ChunkPos getPos()`
- `public void addPlayer( EntityPlayerMP player)`
- `public void removePlayer( EntityPlayerMP player)`
- `public boolean providePlayerChunk(boolean canGenerate)`
- `public boolean sendToPlayers()`
- `public void sendNearbySpecialEntities( EntityPlayerMP player)`
- `public void updateChunkInhabitedTime()`
- `public void blockChanged(int x, int y, int z)`
- `public void sendPacket( Packet <?> packetIn)`
- `public void update()`
- `public boolean containsPlayer( EntityPlayerMP player)`
- `public boolean hasPlayerMatching(com.google.common.base.Predicate< EntityPlayerMP > predicate)`
- `public boolean hasPlayerMatchingInRange(double range, com.google.common.base.Predicate< EntityPlayerMP > predicate)`
- `public boolean isSentToPlayers()`
- `@Nullable public Chunk getChunk()`
- `public double getClosestPlayerDistance()`