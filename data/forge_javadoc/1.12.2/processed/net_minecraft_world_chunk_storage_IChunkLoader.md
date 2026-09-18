# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `Chunk loadChunk( World worldIn, int x, int z) throws java.io.IOException`
- `void saveChunk( World worldIn, Chunk chunkIn) throws MinecraftException , java.io.IOException`
- `void saveExtraChunkData( World worldIn, Chunk chunkIn) throws java.io.IOException`
- `void chunkTick()`
- `void flush()`
- `boolean isChunkGeneratedAt(int x, int z)`