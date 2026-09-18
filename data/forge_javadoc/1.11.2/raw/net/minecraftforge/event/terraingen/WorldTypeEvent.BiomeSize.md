---
title: "WorldTypeEvent.BiomeSize"
description: "BiomeSize is fired when vanilla Minecraft attempts to generate biomes. This event is fired during biome generation in GenLayer.initializeAllBiomeGenerators(long, WorldType, ChunkProviderSettings) . or"
package: "net/minecraftforge/event/terraingen"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/terraingen/WorldTypeEvent.BiomeSize.html"
sourceType: javadoc
---

# WorldTypeEvent.BiomeSize

## Constructors

- `public BiomeSize( WorldType worldType, int original)`

## Methods

- `public int getOriginalSize()`
- `public int getNewSize()`
- `public void setNewSize(int newSize)`

## Description

BiomeSize is fired when vanilla Minecraft attempts to generate biomes. This event is fired during biome generation in GenLayer.initializeAllBiomeGenerators(long, WorldType, ChunkProviderSettings) . or
