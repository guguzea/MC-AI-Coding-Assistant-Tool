# BiomeEvent.GetVillageBlockID

## Constructors

- `public GetVillageBlockID( Biome biome, IBlockState original)`

## Methods

- `public IBlockState getOriginal()`
- `public IBlockState getReplacement()`
- `public void setReplacement( IBlockState replacement)`

## Description

This event is fired when the village generator attempts to choose a block ID based on the village's biome. You can cancel the event to override default values