# ChunkDataEvent.Save

## Constructors

- `public Save( Chunk chunk, NBTTagCompound data)`

## Description

ChunkDataEvent.Save is fired when vanilla Minecraft attempts to save Chunk data. This event is fired during chunk saving in AnvilChunkLoader#saveChunk(World, Chunk). This event is not Cancelable . Thi