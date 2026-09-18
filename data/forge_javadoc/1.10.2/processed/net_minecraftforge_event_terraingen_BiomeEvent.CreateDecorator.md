# BiomeEvent.CreateDecorator

## Constructors

- `public CreateDecorator( Biome biome, BiomeDecorator original)`

## Methods

- `public BiomeDecorator getOriginalBiomeDecorator()`
- `public BiomeDecorator getNewBiomeDecorator()`
- `public void setNewBiomeDecorator( BiomeDecorator newBiomeDecorator)`

## Description

CreateDecorator is fired when a BiomeDecorator is created. This event is fired whenever a BiomeDecorator is created in DeferredBiomeDecorator#fireCreateEventAndReplace(BiomeGenBase) . originalBiomeDec