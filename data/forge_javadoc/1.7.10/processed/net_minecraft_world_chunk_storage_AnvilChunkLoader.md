# AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader , IThreadedFileIO
```

## Constructors

- `public AnvilChunkLoader(java.io.File p_i2003_1_)`

## Methods

- `public Chunk loadChunk( World p_75815_1_, int p_75815_2_, int p_75815_3_) throws java.io.IOException`
- `protected Chunk checkedReadChunkFromNBT( World p_75822_1_, int p_75822_2_, int p_75822_3_, NBTTagCompound p_75822_4_)`
- `public void saveChunk( World p_75816_1_, Chunk p_75816_2_) throws MinecraftException , java.io.IOException`
- `protected void addChunkToPending( ChunkCoordIntPair p_75824_1_, NBTTagCompound p_75824_2_)`
- `public boolean writeNextIO()`
- `public void saveExtraChunkData( World p_75819_1_, Chunk p_75819_2_)`
- `public void chunkTick()`
- `public void saveExtraData()`