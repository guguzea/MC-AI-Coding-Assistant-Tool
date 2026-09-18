---
title: "WorldTypeEvent.InitBiomeGens"
description: "InitBiomeGens is fired when vanilla Minecraft attempts to initialize the biome generators. This event is fired just during biome generator initialization in WorldChunkManager#WorldChunkManager(long, W"
package: "net/minecraftforge/event/terraingen"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/terraingen/WorldTypeEvent.InitBiomeGens.html"
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

InitBiomeGens is fired when vanilla Minecraft attempts to initialize the biome generators. This event is fired just during biome generator initialization in WorldChunkManager#WorldChunkManager(long, W
