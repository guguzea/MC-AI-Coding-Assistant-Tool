# PopulateChunkEvent

## Class signature

```java
public class PopulateChunkEvent extends ChunkGeneratorEvent
```

## Constructors

- `public PopulateChunkEvent( IChunkGenerator gen, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Methods

- `public World getWorld()`
- `public java.util.Random getRand()`
- `public int getChunkX()`
- `public int getChunkZ()`
- `public boolean isHasVillageGenerated()`

## Description

PopulateChunkEvent is fired when an event involving chunk terrain feature population occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class.