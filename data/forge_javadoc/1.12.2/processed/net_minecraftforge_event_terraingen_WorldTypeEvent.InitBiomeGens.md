# WorldTypeEvent.InitBiomeGens

## Constructors

- `public InitBiomeGens( WorldType worldType, long seed, GenLayer [] original)`

## Methods

- `public long getSeed()`
- `public GenLayer [] getOriginalBiomeGens()`
- `public GenLayer [] getNewBiomeGens()`
- `public void setNewBiomeGens( GenLayer [] newBiomeGens)`

## Description

InitBiomeGens is fired when vanilla Minecraft attempts to initialize the biome providers. This event is fired just during biome provider initialization in BiomeProvider(long, WorldType, String) . seed