---
title: "WorldTypeEvent.InitBiomeGens"
description: "InitBiomeGens is fired when vanilla Minecraft attempts to initialize the biome providers. This event is fired just during biome provider initialization in BiomeProvider(long, WorldType, String) . seed"
package: "net/minecraftforge/event/terraingen"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/terraingen/WorldTypeEvent.InitBiomeGens.html"
sourceType: javadoc
---

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
