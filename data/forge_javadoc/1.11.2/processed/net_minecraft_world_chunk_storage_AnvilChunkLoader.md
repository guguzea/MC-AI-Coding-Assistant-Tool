# AnvilChunkLoader

## Class signature

```java
public class AnvilChunkLoader extends java.lang.Object implements IChunkLoader , IThreadedFileIO
```

## Constructors

- `public AnvilChunkLoader(java.io.File chunkSaveLocationIn, DataFixer dataFixerIn)`

## Methods

- `public boolean chunkExists( World world, int x, int z)`
- `@Nullable public Chunk loadChunk( World worldIn, int x, int z) throws java.io.IOException`
- `public java.lang.Object[] loadChunk__Async( World worldIn, int x, int z) throws java.io.IOException`
- `public boolean isChunkGeneratedAt(int p_191063_1_, int p_191063_2_)`
- `@Nullable protected Chunk checkedReadChunkFromNBT( World worldIn, int x, int z, NBTTagCompound compound)`
- `protected java.lang.Object[] checkedReadChunkFromNBT__Async( World worldIn, int x, int z, NBTTagCompound compound)`
- `public void saveChunk( World worldIn, Chunk chunkIn) throws MinecraftException , java.io.IOException`
- `protected void addChunkToPending( ChunkPos pos, NBTTagCompound compound)`
- `public boolean writeNextIO()`
- `public void saveExtraChunkData( World worldIn, Chunk chunkIn) throws java.io.IOException`
- `public void chunkTick()`
- `public void saveExtraData()`
- `public static void registerFixes( DataFixer fixer)`
- `public void loadEntities( World worldIn, NBTTagCompound compound, Chunk chunk)`
- `@Nullable public static Entity readChunkEntity( NBTTagCompound compound, World worldIn, Chunk chunkIn)`
- `@Nullable public static Entity readWorldEntityPos( NBTTagCompound compound, World worldIn, double x, double y, double z, boolean attemptSpawn)`
- `@Nullable protected static Entity createEntityFromNBT( NBTTagCompound compound, World worldIn)`
- `public static void spawnEntity( Entity entityIn, World worldIn)`
- `@Nullable public static Entity readWorldEntity( NBTTagCompound compound, World worldIn, boolean p_186051_2_)`