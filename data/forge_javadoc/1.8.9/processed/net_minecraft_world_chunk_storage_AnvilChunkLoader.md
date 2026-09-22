# AnvilChunkLoader

**Inheritance:** java.lang.Object → net.minecraft.world.chunk.storage.AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader, IThreadedFileIO
```

## Constructors

- `AnvilChunkLoader(java.io.File chunkSaveLocationIn)`

## Methods

- `protected void addChunkToPending(ChunkCoordIntPair p_75824_1_, NBTTagCompound p_75824_2_)`
- `protected java.lang.Object[] checkedReadChunkFromNBT__Async(World worldIn, int x, int z, NBTTagCompound p_75822_4_)`
- `protected Chunk checkedReadChunkFromNBT(World worldIn, int x, int z, NBTTagCompound p_75822_4_)` — Wraps readChunkFromNBT.
- `boolean chunkExists(World world, int x, int z)`
- `void chunkTick()` — Called every World.tick()
- `java.lang.Object[] loadChunk__Async(World worldIn, int x, int z)`
- `Chunk loadChunk(World worldIn, int x, int z)` — Loads the specified(XZ) chunk into the specified world.
- `void loadEntities(World worldIn, NBTTagCompound p_75823_2_, Chunk chunk)`
- `void saveChunk(World worldIn, Chunk chunkIn)`
- `void saveExtraChunkData(World worldIn, Chunk chunkIn)` — Save extra data associated with this Chunk not normally saved during autosave, only during chunk unload.
- `void saveExtraData()` — Save extra data not associated with any Chunk.
- `boolean writeNextIO()` — Returns a boolean stating if the write was unsuccessful.

## Fields

- `java.io.File chunkSaveLocation` — Save directory for chunks using the Anvil format