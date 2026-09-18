# ChunkEvent.Load

## Constructors

- `public Load( Chunk chunk)`

## Description

ChunkEvent.Load is fired when vanilla Minecraft attempts to load a Chunk into the world. This event is fired during chunk loading in ChunkProviderClient.loadChunk(int, int) , Chunk.onChunkLoad(). This