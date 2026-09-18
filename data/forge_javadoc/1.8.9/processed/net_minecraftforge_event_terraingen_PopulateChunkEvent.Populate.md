# PopulateChunkEvent.Populate

## Constructors

- `public Populate( IChunkProvider chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated, PopulateChunkEvent.Populate.EventType type)`

## Description

PopulateChunkEvent.Populate is fired when a chunk is populated with a terrain feature. This event is fired during terrain feature generation in ChunkProviderEnd#populate(IChunkProvider, int, int), Chu