---
title: "BiomeEvent.GetVillageBlockID"
description: "This event is fired when the village generator attempts to choose a block ID based on the village's biome. You can cancel the event to override default values"
package: "net/minecraftforge/event/terraingen"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/terraingen/BiomeEvent.GetVillageBlockID.html"
sourceType: javadoc
---

# BiomeEvent.GetVillageBlockID

## Constructors

- `public GetVillageBlockID( Biome biome, IBlockState original)`

## Methods

- `public IBlockState getOriginal()`
- `public IBlockState getReplacement()`
- `public void setReplacement( IBlockState replacement)`

## Description

This event is fired when the village generator attempts to choose a block ID based on the village's biome. You can cancel the event to override default values
