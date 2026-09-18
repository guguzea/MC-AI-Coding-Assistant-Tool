# PopulateChunkEvent.Pre

## Constructors

- `public Pre( IChunkGenerator gen, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Description

PopulateChunkEvent.Pre is fired just before a chunk is populated a terrain feature. This event is fired just before terrain feature generation in ChunkProviderEnd#populate(IChunkProvider, int, int), C