---
title: "ChunkProviderEvent.InitNoiseField"
description: "This event is fired before a chunks terrain noise field is initialized. You can set the result to DENY to substitute your own noise field."
package: "net/minecraftforge/event/terraingen"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/terraingen/ChunkProviderEvent.InitNoiseField.html"
sourceType: javadoc
---

# ChunkProviderEvent.InitNoiseField

## Constructors

- `public InitNoiseField( IChunkProvider chunkProvider, double[] noisefield, int posX, int posY, int posZ, int sizeX, int sizeY, int sizeZ)`

## Description

This event is fired before a chunks terrain noise field is initialized. You can set the result to DENY to substitute your own noise field.
