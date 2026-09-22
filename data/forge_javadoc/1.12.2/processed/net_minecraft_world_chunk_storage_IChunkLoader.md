# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `void chunkTick()`
- `void flush()`
- `boolean isChunkGeneratedAt(int x, int z)`
- `Chunk loadChunk(World worldIn, int x, int z)`
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)`