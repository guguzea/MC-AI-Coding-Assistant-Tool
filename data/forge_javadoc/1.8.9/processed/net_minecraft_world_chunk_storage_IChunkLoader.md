# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `void chunkTick()` — Called every World.tick()
- `Chunk loadChunk(World worldIn, int x, int z)` — Loads the specified(XZ) chunk into the specified world.
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)` — Save extra data associated with this Chunk not normally saved during autosave, only during chunk unload.
- `void saveExtraData()` — Save extra data not associated with any Chunk.