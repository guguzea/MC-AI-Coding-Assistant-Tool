---
title: "OreGenEvent"
description: "OreGenEvent is fired when an event involving ore generation occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. world contains the world "
package: "net/minecraftforge/event/terraingen"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/event/terraingen/OreGenEvent.html"
sourceType: javadoc
---

# OreGenEvent

## Class signature

```java
public class OreGenEvent extends Event
```

## Constructors

- `public OreGenEvent( World world, java.util.Random rand, BlockPos pos)`

## Methods

- `public World getWorld()`
- `public java.util.Random getRand()`
- `public BlockPos getPos()`

## Description

OreGenEvent is fired when an event involving ore generation occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. world contains the world 
