---
title: "ChunkWatchEvent"
description: "ChunkWatchEvent is fired when an event involving a chunk being watched occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. chunk contains"
package: "net/minecraftforge/event/world"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/world/ChunkWatchEvent.html"
sourceType: javadoc
---

# ChunkWatchEvent

## Class signature

```java
public class ChunkWatchEvent extends Event
```

## Constructors

- `public ChunkWatchEvent( ChunkPos chunk, EntityPlayerMP player)`

## Methods

- `public ChunkPos getChunk()`
- `public EntityPlayerMP getPlayer()`

## Description

ChunkWatchEvent is fired when an event involving a chunk being watched occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. chunk contains
