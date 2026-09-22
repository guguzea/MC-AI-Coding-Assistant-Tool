# AnvilChunkLoader

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader, IThreadedFileIO
```

## Constructors

- `AnvilChunkLoader(java.io.File chunkSaveLocationIn, DataFixer dataFixerIn)`

## Methods

- `protected void addChunkToPending(ChunkPos pos, NBTTagCompound compound)`
- `protected java.lang.Object[] checkedReadChunkFromNBT__Async(World worldIn, int x, int z, NBTTagCompound compound)`
- `protected Chunk checkedReadChunkFromNBT(World worldIn, int x, int z, NBTTagCompound compound)`
- `@Deprecated boolean chunkExists(World world, int x, int z)`
- `void chunkTick()`
- `protected static Entity createEntityFromNBT(NBTTagCompound compound, World worldIn)`
- `void flush()`
- `int getPendingSaveCount()`
- `boolean isChunkGeneratedAt(int x, int z)`
- `java.lang.Object[] loadChunk__Async(World worldIn, int x, int z)`
- `Chunk loadChunk(World worldIn, int x, int z)`
- `void loadEntities(World worldIn, NBTTagCompound compound, Chunk chunk)`
- `static Entity readChunkEntity(NBTTagCompound compound, World worldIn, Chunk chunkIn)`
- `static Entity readWorldEntity(NBTTagCompound compound, World worldIn, boolean p_186051_2_)`
- `static Entity readWorldEntityPos(NBTTagCompound compound, World worldIn, double x, double y, double z, boolean attemptSpawn)`
- `static void registerFixes(DataFixer fixer)`
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)`
- `static void spawnEntity(Entity entityIn, World worldIn)`
- `boolean writeNextIO()`

## Fields

- `java.io.File chunkSaveLocation`