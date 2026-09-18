# WorldTypeEvent.BiomeSize

## Constructors

- `public BiomeSize( WorldType worldType, int original)`

## Methods

- `public int getOriginalSize()`
- `public int getNewSize()`
- `public void setNewSize(int newSize)`

## Description

BiomeSize is fired when vanilla Minecraft attempts to generate biomes. This event is fired during biome generation in GenLayer#initializeAllBiomeGenerators(long, WorldType, ChunkProviderSettings) . or