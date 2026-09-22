# PopulateChunkEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.terraingen.ChunkGeneratorEvent → net.minecraftforge.event.terraingen.PopulateChunkEvent

## Class signature

```java
public class PopulateChunkEvent extends ChunkGeneratorEvent
```

## Constructors

- `PopulateChunkEvent(IChunkGenerator gen, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Methods

- `int getChunkX()`
- `int getChunkZ()`
- `java.util.Random getRand()`
- `World getWorld()`
- `boolean isHasVillageGenerated()`