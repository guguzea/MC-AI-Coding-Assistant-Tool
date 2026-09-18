# ChunkProviderEvent.InitNoiseField

## Constructors

- `public InitNoiseField( IChunkProvider chunkProvider, double[] noisefield, int posX, int posY, int posZ, int sizeX, int sizeY, int sizeZ)`

## Description

This event is fired before a chunks terrain noise field is initialized. You can set the result to DENY to substitute your own noise field.