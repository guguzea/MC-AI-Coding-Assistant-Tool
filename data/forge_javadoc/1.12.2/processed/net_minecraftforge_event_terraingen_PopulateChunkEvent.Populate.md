# PopulateChunkEvent.Populate

## Constructors

- `public Populate( IChunkGenerator gen, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated, PopulateChunkEvent.Populate.EventType type)`

## Methods

- `public PopulateChunkEvent.Populate.EventType getType()`

## Description

PopulateChunkEvent.Populate is fired when a chunk is populated with a terrain feature. This event is fired during terrain feature generation in ChunkProviderEnd#populate(int, int) , ChunkProviderOverw