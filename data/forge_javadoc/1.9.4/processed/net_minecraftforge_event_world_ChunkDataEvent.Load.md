# ChunkDataEvent.Load

## Constructors

- `public Load( Chunk chunk, NBTTagCompound data)`

## Description

ChunkDataEvent.Load is fired when vanilla Minecraft attempts to load Chunk data. This event is fired during chunk loading in ChunkIOProvider#callStage2(QueuedChunk, Chunk). This event is not Cancelabl