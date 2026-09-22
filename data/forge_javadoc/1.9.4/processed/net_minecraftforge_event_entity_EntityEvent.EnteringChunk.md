# EntityEvent.EnteringChunk

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.entity.EntityEvent → net.minecraftforge.event.entity.EntityEvent.EnteringChunk

## Class signature

```java
public static class EntityEvent.EnteringChunk extends EntityEvent
```

## Constructors

- `EnteringChunk(Entity entity, int newChunkX, int newChunkZ, int oldChunkX, int oldChunkZ)`

## Methods

- `int getNewChunkX()`
- `int getNewChunkZ()`
- `int getOldChunkX()`
- `int getOldChunkZ()`
- `void setNewChunkX(int newChunkX)`
- `void setNewChunkZ(int newChunkZ)`
- `void setOldChunkX(int oldChunkX)`
- `void setOldChunkZ(int oldChunkZ)`