# PopulateChunkEvent.Post

## Constructors

- `public Post( IChunkGenerator chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Description

PopulateChunkEvent.Post is fired just after a chunk is populated with a terrain feature. This event is fired just after terrain feature generation in ChunkProviderEnd#populate(IChunkProvider, int, int