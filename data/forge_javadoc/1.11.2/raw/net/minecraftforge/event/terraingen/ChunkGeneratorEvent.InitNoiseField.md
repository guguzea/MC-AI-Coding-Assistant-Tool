---
title: "ChunkGeneratorEvent.InitNoiseField"
description: "This event is fired before a chunks terrain noise field is initialized. You can set the result to DENY to substitute your own noise field."
package: "net/minecraftforge/event/terraingen"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/terraingen/ChunkGeneratorEvent.InitNoiseField.html"
sourceType: javadoc
---

# ChunkGeneratorEvent.InitNoiseField

## Constructors

- `public InitNoiseField( IChunkGenerator chunkProvider, double[] noisefield, int posX, int posY, int posZ, int sizeX, int sizeY, int sizeZ)`

## Methods

- `public double[] getNoisefield()`
- `public void setNoisefield(double[] noisefield)`
- `public int getPosX()`
- `public int getPosY()`
- `public int getPosZ()`
- `public int getSizeX()`
- `public int getSizeY()`
- `public int getSizeZ()`

## Description

This event is fired before a chunks terrain noise field is initialized. You can set the result to DENY to substitute your own noise field.
