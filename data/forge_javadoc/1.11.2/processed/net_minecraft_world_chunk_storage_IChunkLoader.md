# IChunkLoader

## Class signature

```java
public interface IChunkLoader
```

## Methods

- `@Nullable Chunk loadChunk( World worldIn, int x, int z) throws java.io.IOException`
- `void saveChunk( World worldIn, Chunk chunkIn) throws MinecraftException , java.io.IOException`
- `void saveExtraChunkData( World worldIn, Chunk chunkIn) throws java.io.IOException`
- `void chunkTick()`
- `void saveExtraData()`
- `boolean isChunkGeneratedAt(int p_191063_1_, int p_191063_2_)`