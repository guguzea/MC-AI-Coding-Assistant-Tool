---
title: "PopulateChunkEvent"
description: "PopulateChunkEvent is fired when an event involving chunk terrain feature population occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. "
package: "net/minecraftforge/event/terraingen"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/terraingen/PopulateChunkEvent.html"
sourceType: javadoc
---

# PopulateChunkEvent

## Class signature

```java
public class PopulateChunkEvent extends ChunkProviderEvent
```

## Constructors

- `public PopulateChunkEvent( IChunkProvider chunkProvider, World world, java.util.Random rand, int chunkX, int chunkZ, boolean hasVillageGenerated)`

## Description

PopulateChunkEvent is fired when an event involving chunk terrain feature population occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. 
