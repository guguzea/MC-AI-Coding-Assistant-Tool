# PopulateChunkEvent

## Class signature

```java
public class PopulateChunkEvent extends ChunkProviderEvent
```

## Constructors

- `public PopulateChunkEvent( IChunkProvider chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Description

PopulateChunkEvent is fired when an event involving chunk terrain feature population occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class.