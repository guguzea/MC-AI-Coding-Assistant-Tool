---
title: "EntityEvent.EnteringChunk"
description: "EnteringChunk is fired when an Entity enters a chunk. This event is fired whenever vanilla Minecraft determines that an entity is entering a chunk in Chunk.addEntity(net.minecraft.entity.Entity) This "
package: "net/minecraftforge/event/entity"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/EntityEvent.EnteringChunk.html"
sourceType: javadoc
---

# EntityEvent.EnteringChunk

## Constructors

- `public EnteringChunk( Entity entity, int newChunkX, int newChunkZ, int oldChunkX, int oldChunkZ)`

## Methods

- `public int getNewChunkX()`
- `public void setNewChunkX(int newChunkX)`
- `public int getNewChunkZ()`
- `public void setNewChunkZ(int newChunkZ)`
- `public int getOldChunkX()`
- `public void setOldChunkX(int oldChunkX)`
- `public int getOldChunkZ()`
- `public void setOldChunkZ(int oldChunkZ)`

## Description

EnteringChunk is fired when an Entity enters a chunk. This event is fired whenever vanilla Minecraft determines that an entity is entering a chunk in Chunk.addEntity(net.minecraft.entity.Entity) This 
