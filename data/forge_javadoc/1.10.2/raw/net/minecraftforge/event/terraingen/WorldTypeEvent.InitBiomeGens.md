---
title: "WorldTypeEvent.InitBiomeGens"
description: "InitBiomeGens is fired when vanilla Minecraft attempts to initialize the biome providers. This event is fired just during biome provider initialization in BiomeProvider.BiomeProvider(long, WorldType, "
package: "net/minecraftforge/event/terraingen"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/terraingen/WorldTypeEvent.InitBiomeGens.html"
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

InitBiomeGens is fired when vanilla Minecraft attempts to initialize the biome providers. This event is fired just during biome provider initialization in BiomeProvider.BiomeProvider(long, WorldType, 
