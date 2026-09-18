---
title: "S41PacketServerDifficulty"
description: "Passes this Packet on to the NetHandler for processing."
package: "net/minecraft/network/play/server"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/play/server/S41PacketServerDifficulty.html"
sourceType: javadoc
---

# S41PacketServerDifficulty

## Class signature

```java
public class S41PacketServerDifficulty extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S41PacketServerDifficulty()`
- `public S41PacketServerDifficulty( EnumDifficulty difficultyIn, boolean lockedIn)`

## Methods

- `public void processPacket( INetHandlerPlayClient handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public boolean isDifficultyLocked()`
- `public EnumDifficulty getDifficulty()`

## Description

Passes this Packet on to the NetHandler for processing.
