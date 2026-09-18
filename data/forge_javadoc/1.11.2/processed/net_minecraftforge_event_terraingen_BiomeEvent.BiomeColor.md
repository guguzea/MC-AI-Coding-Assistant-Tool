# BiomeEvent.BiomeColor

## Constructors

- `public BiomeColor( Biome biome, int original)`

## Methods

- `public int getOriginalColor()`
- `public int getNewColor()`
- `public void setNewColor(int newColor)`

## Description

BiomeColor is fired whenever an event involving biome colors occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. All children of this eve