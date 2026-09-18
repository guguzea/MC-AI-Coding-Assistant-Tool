# EntityEvent.EnteringChunk

## Constructors

- `public EnteringChunk( Entity entity, int newChunkX, int newChunkZ, int oldChunkX, int oldChunkZ)`

## Description

EnteringChunk is fired when an Entity enters a chunk. This event is fired whenever vanilla Minecraft determines that an entity is entering a chunk in Chunk#addEntity(net.minecraft.entity.Entity) This