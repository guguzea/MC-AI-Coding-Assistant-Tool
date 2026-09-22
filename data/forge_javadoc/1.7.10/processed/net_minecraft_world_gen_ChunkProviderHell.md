# ChunkProviderHell

**Inheritance:** java.lang.Object → net.minecraft.world.gen.ChunkProviderHell

## Class signature

```java
public class ChunkProviderHell extends java.lang.Object implements IChunkProvider
```

## Constructors

- `ChunkProviderHell(World p_i2005_1_, long p_i2005_2_)`

## Methods

- `boolean canSave()`
- `boolean chunkExists(int p_73149_1_, int p_73149_2_)`
- `ChunkPosition func_147416_a(World p_147416_1_, java.lang.String p_147416_2_, int p_147416_3_, int p_147416_4_, int p_147416_5_)`
- `void func_147418_b(int p_147418_1_, int p_147418_2_, Block [] p_147418_3_)`
- `void func_147419_a(int p_147419_1_, int p_147419_2_, Block [] p_147419_3_)`
- `int getLoadedChunkCount()`
- `java.util.List getPossibleCreatures(EnumCreatureType p_73155_1_, int p_73155_2_, int p_73155_3_, int p_73155_4_)`
- `Chunk loadChunk(int p_73158_1_, int p_73158_2_)`
- `java.lang.String makeString()`
- `void populate(IChunkProvider p_73153_1_, int p_73153_2_, int p_73153_3_)`
- `Chunk provideChunk(int p_73154_1_, int p_73154_2_)`
- `void recreateStructures(int p_82695_1_, int p_82695_2_)`
- `boolean saveChunks(boolean p_73151_1_, IProgressUpdate p_73151_2_)`
- `void saveExtraData()`
- `boolean unloadQueuedChunks()`

## Fields

- `MapGenNetherBridge genNetherBridge`
- `NoiseGeneratorOctaves netherNoiseGen6`
- `NoiseGeneratorOctaves netherNoiseGen7`