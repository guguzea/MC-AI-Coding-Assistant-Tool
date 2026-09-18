---
title: "OreGenEvent.GenerateMinable"
description: "GenerateMinable is fired when a mineable block is generated in a chunk. This event is fired just after ore generation in BiomeDecorator#generateOres(). type contains the enum value for the Ore attempt"
package: "net/minecraftforge/event/terraingen"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/terraingen/OreGenEvent.GenerateMinable.html"
sourceType: javadoc
---

# OreGenEvent.GenerateMinable

## Constructors

- `public GenerateMinable( World world, java.util.Random rand, WorldGenerator generator, BlockPos pos, OreGenEvent.GenerateMinable.EventType type)`

## Methods

- `public OreGenEvent.GenerateMinable.EventType getType()`
- `public WorldGenerator getGenerator()`

## Description

GenerateMinable is fired when a mineable block is generated in a chunk. This event is fired just after ore generation in BiomeDecorator#generateOres(). type contains the enum value for the Ore attempt
